# View

A View groups dashboard Widgets and can apply an analytics scope to their requests. Obtain a View from Metrix's Views service when integration code needs to inspect or change that scope:

```php
use verbb\metrix\Metrix;

$views = Metrix::$plugin->getViews();
$view = $views->getViewByHandle('mainDashboard');

if (!$view) {
    throw new \RuntimeException('The mainDashboard Metrix View does not exist.');
}
```

<span id="attributes"></span>

## Properties

::: reference
### `id`

**Type:** `int|null`

The unique identifier for the view, or `null` before it’s saved.
:::

::: reference
### `name`

**Type:** `string|null`

The name of the view.
:::

::: reference
### `handle`

**Type:** `string|null`

The handle of the view.
:::

## Analytics Scope

Views can optionally scope every widget fetch to a Craft site, path prefix, or hostname. That is stored under `settings.analyticsScope` and applied by providers that support it (Google Analytics, Plausible path filters, Matomo segments).

When a Craft site is selected, Metrix derives the filter from the site’s base URL: a different host than the primary site becomes a hostname filter; a shared root URL becomes a path-prefix filter.

For separate analytics properties or domains, continue to use separate Sources. View scope is for one property covering multiple Craft sites.

## Methods

::: reference
### `getAnalyticsScope()`

**Returns:** `verbb\metrix\models\AnalyticsScope`

Returns the resolved `AnalyticsScope` model for the view.
:::

::: reference
### `setAnalyticsScope()`

**Returns:** `void`

**Arguments:** `AnalyticsScope|array|null $scope`

Stores an analytics scope in `settings`. Pass `null` to clear it.
:::

The following example restricts the View to analytics paths beginning with `/shop`:

```php
use verbb\metrix\models\AnalyticsScope;

$view->setAnalyticsScope([
    'mode' => AnalyticsScope::MODE_PATH,
    'pathPrefix' => '/shop',
]);

$views->saveView($view);
```
