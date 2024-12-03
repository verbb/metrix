<?php
namespace verbb\metrix\base;

use verbb\metrix\Metrix;
use verbb\metrix\services\Service;
use verbb\metrix\services\Sources;
use verbb\metrix\web\assets\charts\MetrixAsset;

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

    public function getService(): Service
    {
        return $this->get('service');
    }

    public function getSources(): Sources
    {
        return $this->get('sources');
    }

    public function getVite(): VitePluginService
    {
        return $this->get('vite');
    }


    // Private Methods
    // =========================================================================

    private function _setPluginComponents(): void
    {
        $this->setComponents([
            'service' => Service::class,
            'sources' => Sources::class,
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
        ]);
        
        Auth::registerModule();
        BaseHelper::registerModule();
    }

    private function _setLogging(): void
    {
        BaseHelper::setFileLogging('metrix');
    }

}