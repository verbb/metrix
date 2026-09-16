# Widget

A Widget object stores one dashboard component's Source, View, metric and display settings. Obtain widgets through Metrix's Widgets service when extending dashboard behaviour; use the Control Panel for ordinary widget configuration.

<span id="attributes"></span>

## Properties

::: reference
### `id`

**Type:** `string|int|null`

The unique identifier for the widget.
:::

::: reference
### `source`

**Type:** `verbb\metrix\base\SourceInterface|null`

The Source the widget reads from.
:::

::: reference
### `view`

**Type:** `verbb\metrix\models\View|null`

The View the widget belongs to.
:::

::: reference
### `period`

**Type:** `string|null`

Period class for data (unless inheriting the View range).
:::

::: reference
### `inheritPeriod`

**Type:** `bool|null`

When true, use the View’s dashboard date range.
:::

::: reference
### `metric`

**Type:** `string|null`

Metric key for the widget.
:::

::: reference
### `dimension`

**Type:** `string|null`

Dimension key (table/pie and similar).
:::

::: reference
### `canonicalMetric` / `canonicalDimension`

**Type:** `string|null`

Normalised keys across providers.
:::

::: reference
### `width`

**Type:** `int|null`

Layout width (1–3 thirds).
:::

::: reference
### `title` / `subtitle`

**Type:** `string|null`

Optional display labels.
:::

::: reference
### `limit`

**Type:** `int|null`

Optional row limit for table/pie-style widgets.
:::

## Methods

::: reference
### `getSource(): ?SourceInterface`

**Returns:** `verbb\metrix\base\SourceInterface|null`

Resolves the Widget's Source.
:::

::: reference
### `setSource(SourceInterface|string $source): void`

Assigns a Source object or configured Source handle.
:::

::: reference
### `getView(): ?View`

**Returns:** `verbb\metrix\models\View|null`

Resolves the Widget's View.
:::

::: reference
### `setView(View $view): void`

Assigns a View object.
:::

::: reference
### `getResolvedMetric(): ?string`

**Returns:** `string|null`

Returns the provider-native metric after resolving a canonical metric for the Widget's Source.
:::

::: reference
### `getResolvedDimension(): ?string`

**Returns:** `string|null`

Returns the provider-native dimension after resolving a canonical dimension for the Widget's Source.
:::

::: reference
### `getResolvedPeriod(?string $globalPeriod = null): ?string`

**Returns:** `string|null`

Returns the supplied global period when the Widget inherits the dashboard range, otherwise the Widget's configured period. An inheriting Widget with neither value uses Last 30 Days.
:::

::: reference
### `getRowLimit(): int`

**Returns:** `int`

Returns the effective row limit for dimension widgets. The default is 10 and the maximum is 500.
:::

The following example assigns a configured Source by handle and inspects the provider-native values Metrix will request:

```php
$widget->setSource('analytics');

$metric = $widget->getResolvedMetric();
$dimension = $widget->getResolvedDimension();
```
