<?php
namespace verbb\metrix\helpers;

use verbb\metrix\Metrix;
use verbb\metrix\sources\MissingSource;

use Craft;
use craft\helpers\UrlHelper;

class DashboardSetup
{
    // Static Methods
    // =========================================================================

    /**
     * Returns the dashboard's setup steps, or null once the first widget has been added. That's the dashboard's
     * first real outcome, so the checklist stays gone even if every widget is later removed.
     */
    public static function getSteps(): ?array
    {
        if (Metrix::$plugin->getWidgets()->hasAddedWidgets()) {
            return null;
        }

        $user = Craft::$app->getUser();
        $canManageSources = $user->checkPermission('metrix-sources');
        $canConnectSources = $canManageSources && $user->checkPermission(Metrix::MANAGE_SOURCE_CREDENTIALS_PERMISSION);

        $hasSource = false;
        $hasConnectedSource = false;
        $sourceToConnect = null;

        foreach (Metrix::$plugin->getSources()->getAllSources() as $source) {
            if ($source instanceof MissingSource) {
                continue;
            }

            $hasSource = true;

            if ($source->enabled && $source->isConnected()) {
                $hasConnectedSource = true;

                break;
            }

            $sourceToConnect ??= $source;
        }

        return [
            'canManageSources' => $canManageSources,
            'canConnectSources' => $canConnectSources,
            'source' => [
                'done' => $hasSource,
                'url' => $canManageSources ? UrlHelper::cpUrl('metrix/sources/new') : null,
            ],
            'connect' => [
                'done' => $hasConnectedSource,
                'sourceName' => $sourceToConnect?->name,
                'url' => $canConnectSources && $sourceToConnect ? $sourceToConnect->getCpEditUrl() : null,
            ],
            'widgets' => [
                'done' => false,
            ],
        ];
    }
}
