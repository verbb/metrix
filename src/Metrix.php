<?php
namespace verbb\metrix;

use verbb\metrix\base\PluginTrait;
use verbb\metrix\gql\interfaces\MetrixInterface;
use verbb\metrix\gql\queries\MetrixQuery;
use verbb\metrix\models\Settings;
use verbb\metrix\variables\MetrixVariable;

use Craft;
use craft\base\Model;
use craft\base\Plugin;
use craft\events\RegisterComponentTypesEvent;
use craft\events\RegisterGqlQueriesEvent;
use craft\events\RegisterGqlSchemaComponentsEvent;
use craft\events\RegisterGqlTypesEvent;
use craft\events\RegisterUrlRulesEvent;
use craft\events\RegisterUserPermissionsEvent;
use craft\helpers\UrlHelper;
use craft\services\Gql;
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
        $this->_registerGraphQl();

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
            $event->rules['metrix/settings'] = 'metrix/plugin/settings';

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
            $event->permissions[] = [
                'heading' => Craft::t('metrix', 'Metrix'),
                'permissions' => [
                    'metrix-dashboard' => ['label' => Craft::t('metrix', 'Dashboard')],
                    'metrix-sources' => ['label' => Craft::t('metrix', 'Sources')],
                ],
            ];
        });
    }

    private function _registerGraphQl(): void
    {
        Event::on(Gql::class, Gql::EVENT_REGISTER_GQL_TYPES, function(RegisterGqlTypesEvent $event) {
            $event->types[] = SocialFeedsInterface::class;
        });

        Event::on(Gql::class, Gql::EVENT_REGISTER_GQL_QUERIES, function(RegisterGqlQueriesEvent $event) {
            $queries = SocialFeedsQuery::getQueries();
                    
            foreach ($queries as $key => $value) {
                $event->queries[$key] = $value;
            }
        });

        Event::on(Gql::class, Gql::EVENT_REGISTER_GQL_SCHEMA_COMPONENTS, function (RegisterGqlSchemaComponentsEvent $event) {  
            $label = Craft::t('metrix', 'Metrix');

            $event->queries[$label]['socialFeeds.all:read'] = ['label' => Craft::t('metrix', 'Query Metrix')];
        });
    }
}
