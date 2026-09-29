# Preset

A Preset contains reusable Widget configurations. Obtain one from Metrix's Presets service when a module needs to inspect or assemble a dashboard preset:

```php
$preset = \verbb\metrix\Metrix::$plugin->getPresets()->getPresetByHandle('websiteOverview');

if (!$preset) {
    throw new \RuntimeException('The websiteOverview Metrix Preset does not exist.');
}
```

<span id="attributes"></span>

## Properties

::: reference
### `id`

**Type:** `string|int|null`

The unique identifier for the preset (when stored).
:::

::: reference
### `name`

**Type:** `string|null`

The name of the preset.
:::

::: reference
### `handle`

**Type:** `string|null`

The handle of the preset.
:::

::: reference
### `enabled`

**Type:** `bool`

Whether the preset is enabled.
:::

::: reference
### `widgets`

**Type:** `array`

Widget configs applied when the preset is used.
:::

## Methods

::: reference
### `getWidgets(): array`

**Returns:** `array`

Widget instances / configs for the preset.
:::

::: reference
### `setWidgets(array $widgetConfigs): void`

**Returns:** `void`

Normalises and assigns Widget instances or configuration arrays.
:::

```php
$preset->setWidgets([
    [
        'type' => \verbb\metrix\widgets\Counter::class,
        'source' => 'analytics',
        'canonicalMetric' => 'visitors',
        'width' => 1,
    ],
]);

$widgets = $preset->getWidgets();
```
