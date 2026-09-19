/** Seed genuine Metrix records for a deterministic feature tour. */

use craft\helpers\Db;
use craft\helpers\Json;
use modules\metrixscreenshots\ScreenshotPlausibleSource;
use verbb\metrix\Metrix;
use verbb\metrix\models\Preset;
use verbb\metrix\models\View;
use verbb\metrix\periods\Last7Days;
use verbb\metrix\sources\Cloudflare;
use verbb\metrix\sources\Fathom;
use verbb\metrix\sources\GoogleAnalytics;
use verbb\metrix\sources\Matomo;
use verbb\metrix\sources\MixPanel;
use verbb\metrix\widgets\Counter;
use verbb\metrix\widgets\Line;
use verbb\metrix\widgets\Pie;
use verbb\metrix\widgets\Realtime;
use verbb\metrix\widgets\Table;

$db = Craft::$app->getDb();
$db->createCommand()->delete('{{%metrix_widgets}}')->execute();
$db->createCommand()->delete('{{%metrix_sources}}')->execute();
$db->createCommand()->delete('{{%metrix_views}}')->execute();
$db->createCommand()->delete('{{%metrix_presets}}')->execute();

$views = Metrix::$plugin->getViews();
$overview = new View(['name' => 'Website overview', 'handle' => 'overview']);
$campaigns = new View(['name' => 'Campaigns', 'handle' => 'campaigns']);

foreach ([$overview, $campaigns] as $view) {
    if (!$views->saveView($view)) {
        throw new RuntimeException('Unable to save the Metrix screenshot view: ' . Json::encode($view->getErrors()));
    }
}

$sources = Metrix::$plugin->getSources();
$sourceConfigs = [
    [ScreenshotPlausibleSource::class, 'Plausible — Main site', 'plausibleMain', ['apiKey' => 'screenshot', 'siteId' => 'example.com']],
    [GoogleAnalytics::class, 'Google Analytics', 'googleAnalytics', ['accountId' => '123456', 'propertyId' => '987654']],
    [Fathom::class, 'Fathom', 'fathom', ['apiKey' => 'screenshot', 'siteId' => 'ABCDE']],
    [Matomo::class, 'Matomo', 'matomo', ['apiUrl' => 'https://analytics.example.com', 'apiToken' => 'screenshot', 'siteId' => '1']],
    [Cloudflare::class, 'Cloudflare Web Analytics', 'cloudflare', ['apiToken' => 'screenshot', 'zoneId' => 'screenshot']],
    [MixPanel::class, 'Mixpanel', 'mixpanel', ['username' => 'screenshot', 'password' => 'screenshot', 'projectId' => '12345']],
];

$dashboardSource = null;

foreach ($sourceConfigs as [$type, $name, $handle, $settings]) {
    $source = $sources->createSource([
        'type' => $type,
        'name' => $name,
        'handle' => $handle,
        'enabled' => true,
        'settings' => $settings,
    ]);

    if (!$sources->saveSource($source, false)) {
        throw new RuntimeException('Unable to save the Metrix screenshot source: ' . $handle);
    }

    Db::update('{{%metrix_sources}}', ['cache' => Json::encode(['connection' => 'success'])], ['id' => $source->id]);
    $source->cache = ['connection' => 'success'];

    if ($source instanceof ScreenshotPlausibleSource) {
        $dashboardSource = $source;
    }
}

if (!$dashboardSource) {
    throw new RuntimeException('Unable to create the deterministic Metrix dashboard source.');
}

$widgets = Metrix::$plugin->getWidgets();
$widgetConfigs = [
    [Line::class, 2, Last7Days::class, 'sessions', null],
    [Realtime::class, 1, null, null, null],
    [Counter::class, 1, Last7Days::class, 'sessions', null],
    [Table::class, 1, Last7Days::class, 'sessions', 'country'],
    [Pie::class, 1, Last7Days::class, 'sessions', 'browser'],
    [Table::class, 1, Last7Days::class, 'sessions', 'operatingSystem'],
];

foreach ($widgetConfigs as [$type, $width, $period, $metric, $dimension]) {
    $widget = $widgets->createWidget([
        'type' => $type,
        'sourceId' => $dashboardSource->id,
        'viewId' => $overview->id,
        'width' => $width,
        'period' => $period,
        'metric' => $metric,
        'dimension' => $dimension,
    ]);

    if (!$widgets->saveWidget($widget, false)) {
        throw new RuntimeException('Unable to save a Metrix screenshot widget.');
    }
}

$preset = new Preset([
    'name' => 'Editorial overview',
    'handle' => 'editorialOverview',
    'enabled' => true,
    'widgets' => array_map(static fn(array $config): array => [
        'type' => $config[0],
        'width' => (string)$config[1],
        'period' => $config[2],
        'metric' => $config[3],
        'dimension' => $config[4],
        'source' => $dashboardSource->handle,
    ], $widgetConfigs),
]);

if (!Metrix::$plugin->getPresets()->savePreset($preset, false)) {
    throw new RuntimeException('Unable to save the Metrix screenshot preset: ' . Json::encode($preset->getErrors()));
}

echo Json::encode([
    'dashboardRoute' => '/admin/metrix/dashboard?view=overview',
    'sourcesRoute' => '/admin/metrix/sources',
    'presetRoute' => '/admin/metrix/settings/presets/edit/' . $preset->id . '#widgets',
], JSON_THROW_ON_ERROR);
