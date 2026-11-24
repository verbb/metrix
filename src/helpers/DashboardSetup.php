<?php
namespace verbb\metrix\helpers;

use verbb\metrix\Metrix;
use verbb\metrix\sources\MissingSource;

use Craft;
use craft\helpers\UrlHelper;

use DateTime;
use DateTimeZone;

class DashboardSetup
{
    // Static Methods
    // =========================================================================

    /**
     * Returns the dashboard's setup steps, or null on installs from before the checklist existed and once the first
     * widget has been added. Widgets are what the dashboard lists, and the checklist stays gone even if every widget
     * is later removed.
     */
    public static function getSteps(): ?array
    {
        if (!self::isNewInstall()) {
            return null;
        }

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

    /**
     * Whether Metrix was installed on this environment on or after `Metrix::SETUP_CHECKLIST_SINCE`. Craft records the
     * install date per environment, so this needs no storage of its own. A missing date is an existing install.
     */
    public static function isNewInstall(): bool
    {
        $installDate = Craft::$app->getPlugins()->getStoredPluginInfo(Metrix::$plugin->id)['installDate'] ?? null;

        return $installDate instanceof DateTime && $installDate >= new DateTime(Metrix::SETUP_CHECKLIST_SINCE, new DateTimeZone('UTC'));
    }
}
