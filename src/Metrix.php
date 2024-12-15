<?php
namespace verbb\metrix;

use verbb\metrix\base\PluginTrait;
use verbb\metrix\helpers\ProjectConfigHelper;
use verbb\metrix\models\Settings;
use verbb\metrix\services\Presets;
use verbb\metrix\variables\MetrixVariable;

use Craft;
use craft\base\Model;
use craft\base\Plugin;
use craft\events\RebuildConfigEvent;
use craft\events\RegisterComponentTypesEvent;
use craft\events\RegisterUrlRulesEvent;
use craft\events\RegisterUserPermissionsEvent;
use craft\helpers\UrlHelper;
use craft\services\ProjectConfig;
use craft\services\UserPermissions;
use craft\services\Utilities;
use craft\web\UrlManager;
use craft\web\twig\variables\CraftVariable;

use yii\base\Event;

class Metrix extends Plugin
{
    // Properties
    // =========================================================================

    public bool $hasCpSection = true;
    public bool $hasCpSettings = true;
    public string $schemaVersion = '1.0.0';


    // Traits
    // =========================================================================

    use PluginTrait;


    // Public Methods
    // =========================================================================

    public function init(): void
    {
        parent::init();

        self::$plugin = $this;

        $this->_setPluginComponents();
        $this->_setLogging();
        $this->_registerVariables();
        $this->_registerProjectConfigEventListeners();

        if (Craft::$app->getRequest()->getIsCpRequest()) {
            $this->_registerCpRoutes();
        }

        if (Craft::$app->getRequest()->getIsSiteRequest()) {
            $this->_registerSiteRoutes();
        }
        
        if (Craft::$app->getEdition() === Craft::Pro) {
            $this->_registerPermissions();
        }

        $this->hasCpSection = $this->getSettings()->hasCpSection;
    }

    public function getPluginName(): string
    {
        return Craft::t('metrix', $this->getSettings()->pluginName);
    }

    public function getSettingsResponse(): mixed
    {
        return Craft::$app->getResponse()->redirect(UrlHelper::cpUrl('metrix/settings'));
    }

    public function getCpNavItem(): ?array
    {
        $nav = parent::getCpNavItem();

        $nav['label'] = $this->getPluginName();

        if (Craft::$app->getUser()->checkPermission('metrix-dashboard')) {
            $nav['subnav']['dashboard'] = [
                'label' => Craft::t('metrix', 'Dashboard'),
                'url' => 'metrix/dashboard',
            ];
        }

        if (Craft::$app->getUser()->checkPermission('metrix-sources')) {
            $nav['subnav']['sources'] = [
                'label' => Craft::t('metrix', 'Sources'),
                'url' => 'metrix/sources',
            ];
        }

        if (Craft::$app->getUser()->checkPermission('metrix-views')) {
            $nav['subnav']['views'] = [
                'label' => Craft::t('metrix', 'Views'),
                'url' => 'metrix/views',
            ];
        }

        if (Craft::$app->getUser()->getIsAdmin() && Craft::$app->getConfig()->getGeneral()->allowAdminChanges) {
            $nav['subnav']['settings'] = [
                'label' => Craft::t('metrix', 'Settings'),
                'url' => 'metrix/settings',
            ];
        }

        return $nav;
    }


    // Protected Methods
    // =========================================================================

    protected function createSettingsModel(): Settings
    {
        return new Settings();
    }


    // Private Methods
    // =========================================================================

    private function _registerCpRoutes(): void
    {
        Event::on(UrlManager::class, UrlManager::EVENT_REGISTER_CP_URL_RULES, function(RegisterUrlRulesEvent $event) {
            $event->rules['metrix'] = 'metrix/dashboard/index';
            $event->rules['metrix/dashboard'] = 'metrix/dashboard/index';
            $event->rules['metrix/sources'] = 'metrix/sources/index';
            $event->rules['metrix/sources/new'] = 'metrix/sources/edit';
            $event->rules['metrix/sources/<handle:{handle}>'] = 'metrix/sources/edit';
            $event->rules['metrix/views'] = 'metrix/views';
            $event->rules['metrix/views/new'] = 'metrix/views/edit';
            $event->rules['metrix/views/<handle:{handle}>'] = 'metrix/views/edit';
            $event->rules['metrix/settings'] = 'metrix/settings/index';
            $event->rules['metrix/settings/general'] = 'metrix/settings/index';
            $event->rules['metrix/settings/widgets'] = 'metrix/settings/widgets';
            $event->rules['metrix/settings/presets'] = 'metrix/presets/index';
            $event->rules['metrix/settings/presets/new'] = 'metrix/presets/edit';
            $event->rules['metrix/settings/presets/edit/<presetId:\d+>'] = 'metrix/presets/edit';

            if (Craft::$app->getConfig()->getGeneral()->headlessMode || !Craft::$app->getConfig()->getGeneral()->cpTrigger) {
                $event->rules['metrix/auth/callback'] = 'metrix/auth/callback';
            }
        });
    }

    private function _registerSiteRoutes(): void
    {
        Event::on(UrlManager::class, UrlManager::EVENT_REGISTER_SITE_URL_RULES, function(RegisterUrlRulesEvent $event) {
            $event->rules['metrix/auth/callback'] = 'metrix/auth/callback';
        });
    }

    private function _registerVariables(): void
    {
        Event::on(CraftVariable::class, CraftVariable::EVENT_INIT, function(Event $event) {
            $event->sender->set('metrix', MetrixVariable::class);
        });
    }

    private function _registerPermissions(): void
    {
        Event::on(UserPermissions::class, UserPermissions::EVENT_REGISTER_PERMISSIONS, function(RegisterUserPermissionsEvent $event) {
            $viewPermissions = [];

            foreach ($this->getViews()->getAllViews() as $view) {
                $suffix = ':' . $view->uid;
                $viewPermissions['metrix-dashboard' . $suffix] = ['label' => Craft::t('metrix', 'View “{type}” widgets', ['type' => $view->name])];
            }

            $event->permissions[] = [
                'heading' => Craft::t('metrix', 'Metrix'),
                'permissions' => [
                    'metrix-dashboard' => ['label' => Craft::t('metrix', 'Dashboard'), 'nested' => $viewPermissions],
                    'metrix-sources' => ['label' => Craft::t('metrix', 'Sources')],
                    'metrix-views' => ['label' => Craft::t('metrix', 'Views')],
                ],
            ];
        });
    }

    private function _registerProjectConfigEventListeners(): void
    {
        $projectConfigService = Craft::$app->getProjectConfig();

        $presetsService = $this->getPresets();

        $projectConfigService
            ->onAdd(Presets::CONFIG_PRESETS_KEY . '.{uid}', [$presetsService, 'handleChangedPreset'])
            ->onUpdate(Presets::CONFIG_PRESETS_KEY . '.{uid}', [$presetsService, 'handleChangedPreset'])
            ->onRemove(Presets::CONFIG_PRESETS_KEY . '.{uid}', [$presetsService, 'handleDeletedPreset']);

        Event::on(ProjectConfig::class, ProjectConfig::EVENT_REBUILD, function(RebuildConfigEvent $event) {
            $event->config['metrix'] = ProjectConfigHelper::rebuildProjectConfig();
        });
    }
}
