<?php
namespace verbb\metrix\base;

use verbb\metrix\Metrix;
use verbb\metrix\assetbundles\MetrixAsset;
use verbb\metrix\services\Periods;
use verbb\metrix\services\Presets;
use verbb\metrix\services\Service;
use verbb\metrix\services\Sources;
use verbb\metrix\services\Views;
use verbb\metrix\services\Widgets;

use Craft;

use yii\log\Logger;

use verbb\auth\Auth;
use verbb\base\BaseHelper;

use nystudio107\pluginvite\services\VitePluginService;

trait PluginTrait
{
    // Static Properties
    // =========================================================================

    public static Metrix $plugin;


    // Public Methods
    // =========================================================================

    public static function log(string $message, array $attributes = []): void
    {
        if ($attributes) {
            $message = Craft::t('metrix', $message, $attributes);
        }

        Craft::getLogger()->log($message, Logger::LEVEL_INFO, 'metrix');
    }

    public static function error(string $message, array $attributes = []): void
    {
        if ($attributes) {
            $message = Craft::t('metrix', $message, $attributes);
        }

        Craft::getLogger()->log($message, Logger::LEVEL_ERROR, 'metrix');
    }


    // Public Methods
    // =========================================================================

    public function getPeriods(): Periods
    {
        return $this->get('periods');
    }

    public function getPresets(): Presets
    {
        return $this->get('presets');
    }

    public function getService(): Service
    {
        return $this->get('service');
    }

    public function getSources(): Sources
    {
        return $this->get('sources');
    }

    public function getViews(): Views
    {
        return $this->get('views');
    }

    public function getVite(): VitePluginService
    {
        return $this->get('vite');
    }

    public function getWidgets(): Widgets
    {
        return $this->get('widgets');
    }


    // Private Methods
    // =========================================================================

    private function _setPluginComponents(): void
    {
        $this->setComponents([
            'periods' => Periods::class,
            'presets' => Presets::class,
            'service' => Service::class,
            'sources' => Sources::class,
            'views' => Views::class,
            'vite' => [
                'class' => VitePluginService::class,
                'assetClass' => MetrixAsset::class,
                'useDevServer' => true,
                'devServerPublic' => 'http://localhost:4040/',
                'errorEntry' => 'js/main.js',
                'cacheKeySuffix' => '',
                'devServerInternal' => 'http://localhost:4040/',
                'checkDevServer' => true,
                'includeReactRefreshShim' => true,
            ],
            'widgets' => Widgets::class,
        ]);
        
        Auth::registerModule();
        BaseHelper::registerModule();
    }

    private function _setLogging(): void
    {
        BaseHelper::setFileLogging('metrix');
    }

}