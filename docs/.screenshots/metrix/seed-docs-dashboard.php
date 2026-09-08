/**
 * Seed a Demo Analytics source + screen-2-style Default dashboard for Metrix docs.
 *
 * Also upserts six showcase Sources (GA / Plausible / Matomo / Fathom / Cloudflare /
 * MixPanel) with dummy credentials so the Sources index shows real provider icons.
 * Connected state is faked (cache / OAuth token) — no live API calls.
 *
 * Widgets (grid order): Sessions line (2), Active users realtime (1), Sessions
 * counter (1), Browser pie (1), OS table (1), Country table (1).
 *
 * Echoes JSON: dashboardRoute, sourcesRoute, viewId, sourceId, firstWidgetId, widgetIds.
 * Note: no opening PHP tag — @verbb/docs-screenshots injects this into a bootstrap.
 *
 * Requires modules/metrixdocs (DocsDemoSource) to be bootstrapped in the Craft install.
 */

use craft\helpers\Json;
use verbb\auth\Auth;
use verbb\auth\models\Token as AuthToken;
use verbb\metrix\Metrix;
use verbb\metrix\base\CredentialsSource;
use verbb\metrix\base\OAuthSource;
use verbb\metrix\base\SourceInterface;
use verbb\metrix\models\Preset;
use verbb\metrix\models\View;
use verbb\metrix\periods\Last7Days;
use verbb\metrix\sources\Cloudflare;
use verbb\metrix\sources\Fathom;
use verbb\metrix\sources\GoogleAnalytics;
use verbb\metrix\sources\Matomo;
use verbb\metrix\sources\MixPanel;
use verbb\metrix\sources\Plausible;
use verbb\metrix\widgets\Counter;
use verbb\metrix\widgets\Line;
use verbb\metrix\widgets\Pie;
use verbb\metrix\widgets\Realtime;
use verbb\metrix\widgets\Table;

use modules\metrixdocs\DocsDemoSource;

const DOCS_SOURCE_HANDLE = 'docsDemoAnalytics';

$adminPath = Craft::$app->getConfig()->getGeneral()->cpTrigger ?: 'admin';
$sources = Metrix::$plugin->getSources();
$views = Metrix::$plugin->getViews();
$widgets = Metrix::$plugin->getWidgets();
$presets = Metrix::$plugin->getPresets();

/**
 * Mark a credentials source as Connected without hitting its API.
 * setSettingCache is protected — reflection keeps this docs-only.
 */
$markCredentialsConnected = static function (CredentialsSource $source): void {
    $method = new \ReflectionMethod(CredentialsSource::class, 'setSettingCache');
    $method->setAccessible(true);
    $method->invoke($source, ['connection' => CredentialsSource::CONNECT_SUCCESS]);
};

/**
 * Attach a disposable OAuth2 token so OAuth sources report isConnected().
 */
$markOAuthConnected = static function (OAuthSource $source): void {
    $tokens = Auth::getInstance()->getTokens();
    $token = new AuthToken([
        'ownerHandle' => 'metrix',
        'providerType' => get_class($source),
        'tokenType' => AuthToken::TOKEN_TYPE_OAUTH2,
        'reference' => (string)$source->id,
        'accessToken' => 'docs-fake-access-token',
        'refreshToken' => 'docs-fake-refresh-token',
        // Far-future so nothing treats it as expired during capture.
        'expires' => (string)(time() + 86400 * 365),
        'values' => [],
    ]);

    if (!$tokens->upsertToken($token)) {
        throw new RuntimeException('Unable to upsert docs OAuth token for source ' . $source->handle);
    }
};

/**
 * Upsert a showcase source used only for the Sources index cutout.
 *
 * @param array<string, mixed> $config createSource payload (type, name, handle, enabled, …)
 */
$upsertShowcaseSource = static function (array $config) use ($sources, $markCredentialsConnected, $markOAuthConnected): SourceInterface {
    $handle = $config['handle'];
    $source = $sources->getSourceByHandle($handle);
    $settings = $config['settings'] ?? [];

    if (!$source) {
        $source = $sources->createSource($config);
    } else {
        $source->name = $config['name'] ?? $source->name;
        $source->enabled = $config['enabled'] ?? $source->enabled;
        foreach ($settings as $key => $value) {
            $source->$key = $value;
        }
    }

    if (!$sources->saveSource($source)) {
        throw new RuntimeException('Unable to save Metrix showcase source (' . $handle . '): ' . Json::encode($source->getErrors()));
    }

    // Connected badges: credentials via cache, OAuth via a fake token.
    if ($source instanceof CredentialsSource) {
        $markCredentialsConnected($source);
    } elseif ($source instanceof OAuthSource) {
        $markOAuthConnected($source);
    }

    return $source;
};

$source = $sources->getSourceByHandle(DOCS_SOURCE_HANDLE);

if (!$source) {
    $source = $sources->createSource([
        'type' => DocsDemoSource::class,
        'name' => 'Demo Analytics',
        'handle' => DOCS_SOURCE_HANDLE,
        'enabled' => true,
    ]);
} else {
    $source->name = 'Demo Analytics';
    $source->enabled = true;
}

if (!$sources->saveSource($source)) {
    throw new RuntimeException('Unable to save Metrix demo source: ' . Json::encode($source->getErrors()));
}

$source->checkConnection(false);

// Screen-2 Sources index order — dummy fields only so enabled validation passes.
$showcaseSources = [
    $upsertShowcaseSource([
        'type' => GoogleAnalytics::class,
        'name' => 'Google Analytics',
        'handle' => 'googleAnalytics',
        'enabled' => true,
        'settings' => [
            'clientId' => 'docs-fake-client-id',
            'clientSecret' => 'docs-fake-client-secret',
            'accountId' => 'docs-fake-account',
            'propertyId' => 'docs-fake-property',
        ],
    ]),
    $upsertShowcaseSource([
        'type' => Plausible::class,
        'name' => 'Plausible',
        'handle' => 'plausible',
        'enabled' => true,
        'settings' => [
            'apiKey' => 'docs-fake-api-key',
            'siteId' => 'docs.example.com',
            'baseUrl' => 'https://plausible.io/',
        ],
    ]),
    $upsertShowcaseSource([
        'type' => Matomo::class,
        'name' => 'Matomo',
        'handle' => 'matomo',
        'enabled' => true,
        'settings' => [
            'apiUrl' => 'https://matomo.example.com/',
            'apiToken' => 'docs-fake-api-token',
            'siteId' => '1',
        ],
    ]),
    $upsertShowcaseSource([
        'type' => Fathom::class,
        'name' => 'Fathom',
        'handle' => 'fathom',
        'enabled' => true,
        'settings' => [
            'apiKey' => 'docs-fake-api-key',
            'siteId' => 'ABCDEFGH',
        ],
    ]),
    $upsertShowcaseSource([
        'type' => Cloudflare::class,
        'name' => 'Cloudflare',
        'handle' => 'cloudflare',
        'enabled' => true,
        'settings' => [
            'apiToken' => 'docs-fake-api-token',
            'zoneId' => 'docs-fake-zone-id',
        ],
    ]),
    $upsertShowcaseSource([
        'type' => MixPanel::class,
        'name' => 'MixPanel',
        'handle' => 'mixpanel',
        'enabled' => true,
        'settings' => [
            'username' => 'docs-fake-user',
            'password' => 'docs-fake-password',
            'projectId' => '123456',
        ],
    ]),
];

// Keep showcase rows first (screen-2 order); demo stays last for widgets but is
// hidden in the Sources screenshot DOM so it never appears in the cutout.
$orderedIds = array_map(static fn(SourceInterface $s) => (int)$s->id, $showcaseSources);
$orderedIds[] = (int)$source->id;
$sources->reorderSources($orderedIds);

$view = $views->getViewByHandle('default');

if (!$view) {
    $view = new View([
        'name' => 'General',
        'handle' => 'default',
    ]);

    if (!$views->saveView($view)) {
        throw new RuntimeException('Unable to save Metrix default view: ' . Json::encode($view->getErrors()));
    }
} else {
    // Match the docs cutout view label (“General”).
    $view->name = 'General';
    $views->saveView($view);
}

foreach ($widgets->getAllWidgets() as $existing) {
    if ((int)$existing->viewId === (int)$view->id) {
        $widgets->deleteWidgetById((int)$existing->id);
    }
}

// Order + widths match the classic Metrix dashboard cutout.
$widgetConfigs = [
    [
        'slug' => 'sessions-line',
        'type' => Line::class,
        'width' => 2,
        'title' => 'Sessions',
        'canonicalMetric' => 'sessions',
        'period' => Last7Days::class,
    ],
    [
        'slug' => 'active-users',
        'type' => Realtime::class,
        'width' => 1,
        'title' => 'Active users',
        // Realtime has no period.
        'period' => null,
    ],
    [
        'slug' => 'sessions-counter',
        'type' => Counter::class,
        'width' => 1,
        'title' => 'Sessions',
        'canonicalMetric' => 'sessions',
        'period' => Last7Days::class,
    ],
    [
        'slug' => 'browser-pie',
        'type' => Pie::class,
        'width' => 1,
        'title' => null,
        'canonicalMetric' => 'sessions',
        'canonicalDimension' => 'browser',
        'period' => Last7Days::class,
    ],
    [
        'slug' => 'os-table',
        'type' => Table::class,
        'width' => 1,
        'title' => null,
        'canonicalMetric' => 'sessions',
        'canonicalDimension' => 'os',
        'limit' => 10,
        'period' => Last7Days::class,
    ],
    [
        'slug' => 'country-table',
        'type' => Table::class,
        'width' => 1,
        'title' => null,
        'canonicalMetric' => 'sessions',
        'canonicalDimension' => 'country',
        'limit' => 12,
        'period' => Last7Days::class,
    ],
];

$firstWidgetId = null;
$widgetIds = [];

foreach ($widgetConfigs as $config) {
    $slug = $config['slug'];
    unset($config['slug']);

    $period = $config['period'];
    unset($config['period']);

    $payload = array_merge($config, [
        'sourceId' => $source->id,
        'viewId' => $view->id,
    ]);

    if ($period) {
        $payload['inheritPeriod'] = false;
        $payload['period'] = $period;
    }

    $widget = $widgets->createWidget($payload);

    if (!$widgets->saveWidget($widget)) {
        throw new RuntimeException('Unable to save Metrix widget (' . $slug . '): ' . Json::encode($widget->getErrors()));
    }

    $widget->getWidgetData(null, false);

    $id = (int)$widget->id;
    $firstWidgetId ??= $id;
    $widgetIds[$slug] = $id;
}

// Docs preset for widgets.png — same six widgets as the dashboard, edited under
// Settings → Presets → Widgets tab (Preset | Widgets chrome + New widget).
const DOCS_PRESET_HANDLE = 'docsWebsiteOverview';

$presetWidgetConfigs = [];
foreach ($widgetConfigs as $config) {
    $period = $config['period'] ?? null;
    unset($config['slug'], $config['period']);

    $payload = $config;
    // Presets serialize source by handle when present; omit so the UI picks the
    // first configured source (Demo Analytics) when rendering the editor.
    if ($period) {
        $payload['inheritPeriod'] = false;
        $payload['period'] = $period;
    }

    $presetWidgetConfigs[] = $payload;
}

$preset = $presets->getPresetByHandle(DOCS_PRESET_HANDLE);

if (!$preset) {
    $preset = new Preset([
        'name' => 'Website Overview',
        'handle' => DOCS_PRESET_HANDLE,
        'enabled' => true,
    ]);
} else {
    $preset->name = 'Website Overview';
    $preset->enabled = true;
}

$preset->setWidgets($presetWidgetConfigs);

if (!$presets->savePreset($preset)) {
    throw new RuntimeException('Unable to save Metrix docs preset: ' . Json::encode($preset->getErrors()));
}

// Re-fetch so id is populated after project-config sync.
$preset = $presets->getPresetByHandle(DOCS_PRESET_HANDLE);
if (!$preset || !$preset->id) {
    throw new RuntimeException('Docs preset missing after save.');
}

echo Json::encode([
    'dashboardRoute' => "/{$adminPath}/metrix?view={$view->handle}",
    'sourcesRoute' => "/{$adminPath}/metrix/sources",
    'presetEditRoute' => "/{$adminPath}/metrix/settings/presets/edit/{$preset->id}",
    'presetId' => (int)$preset->id,
    'viewId' => (int)$view->id,
    'viewHandle' => $view->handle,
    'sourceId' => (int)$source->id,
    'sourceHandle' => $source->handle,
    'firstWidgetId' => $firstWidgetId,
    'widgetIds' => $widgetIds,
], JSON_THROW_ON_ERROR);
