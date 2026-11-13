# Widget

A Widget object stores one dashboard component's Source, View, metric and display settings. Obtain widgets through Metrix's Widgets service when extending dashboard behaviour, and use the control panel for ordinary widget configuration.

<span id="attributes"></span>

## Properties

::: reference
### `id`

**Type:** `string|int|null`

The unique identifier for the widget, or `null` before it’s saved.
:::

::: reference
### `source`

**Type:** `verbb\metrix\base\SourceInterface|null`

The Source the widget reads from, through `getSource()` and `setSource()`.
:::

::: reference
### `view`

**Type:** `verbb\metrix\models\View|null`

The View the widget belongs to, through `getView()` and `setView()`. Widgets in a preset have no View.
:::

::: reference
### `period`

**Type:** `string|null`

The Period class the widget fetches data for. It’s ignored while the widget inherits the View’s date range.
:::

::: reference
### `inheritPeriod`

**Type:** `bool|null`

Whether the widget uses the dashboard’s date range in place of its own period.
:::

::: reference
### `metric`

**Type:** `string|null`

The provider-native metric key the widget shows.
:::

::: reference
### `dimension`

**Type:** `string|null`

The provider-native dimension key the widget breaks data down by, for table, pie and similar widgets.
:::

::: reference
### `canonicalMetric`

**Type:** `string|null`

The canonical metric key, which Metrix maps to each provider’s own metric. See `getResolvedMetric()`.
:::

::: reference
### `canonicalDimension`

**Type:** `string|null`

The canonical dimension key, which Metrix maps to each provider’s own dimension. See `getResolvedDimension()`.
:::

::: reference
### `width`

**Type:** `int|null`

The widget’s layout width on the dashboard, in thirds of the row.
:::

::: reference
### `title`

**Type:** `string|null`

The title shown on the widget, or `null` to use the default.
:::

::: reference
### `subtitle`

**Type:** `string|null`

The subtitle shown on the widget, or `null` for none.
:::

::: reference
### `limit`

**Type:** `int|null`

The maximum number of rows for table, pie and similar widgets, from 1 to 500. See `getRowLimit()`.
:::

## Methods

::: reference
### `getSource()`

**Returns:** `verbb\metrix\base\SourceInterface|null`

Returns the widget’s Source, or `null` when none is set.
:::

::: reference
### `setSource()`

**Returns:** `void`

**Arguments:** `SourceInterface|string $source`

Sets the widget’s Source from a Source object or a configured Source handle.
:::

::: reference
### `getView()`

**Returns:** `verbb\metrix\models\View|null`

Returns the View the widget belongs to, or `null` when it has none.
:::

::: reference
### `setView()`

**Returns:** `void`

**Arguments:** `View $view`

Sets the View the widget belongs to.
:::

::: reference
### `getResolvedMetric()`

**Returns:** `string|null`

Returns the provider-native metric after resolving a canonical metric for the widget's Source.
:::

::: reference
### `getResolvedDimension()`

**Returns:** `string|null`

Returns the provider-native dimension after resolving a canonical dimension for the widget's Source.
:::

::: reference
### `getResolvedPeriod()`

**Returns:** `string|null`

**Arguments:** `?string $globalPeriod = null`

Returns the supplied global period when the widget inherits the dashboard range, otherwise the widget's configured period. An inheriting widget with neither value uses Last 30 Days.
:::

::: reference
### `getRowLimit()`

**Returns:** `int`

Returns the effective row limit for dimension widgets. The default is 10 and the maximum is 500.
:::

The following example assigns a configured Source by handle and inspects the provider-native values Metrix will request:

```php
$widget->setSource('analytics');

$metric = $widget->getResolvedMetric();
$dimension = $widget->getResolvedDimension();
```
