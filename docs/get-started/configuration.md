# Configuration

You can customise Metrix’s settings using a PHP configuration file. This is optional: each setting has a default, so you only need to include the values you want to change.

To override a setting, create `metrix.php` in your Craft project’s `/config` directory and return an array of setting names and values. For example, the following will set the real-time refresh interval to 20 seconds:

```php
<?php

return [
    'realtimeInterval' => 20,
];
```

All other settings keep their defaults. Add any further settings you want to change to the same array. The options below explain the available settings and their defaults.

Values in `config/metrix.php` override the corresponding values saved in the control panel. To manage a setting through the control panel again, remove its override from the file.

## Environment Overrides

Craft can apply different settings to each environment. Use `*` for shared values and a key matching `CRAFT_ENVIRONMENT` for an environment-specific override. For example:

```php
<?php

return [
    '*' => [
        'realtimeInterval' => 20,
    ],
    'dev' => [
        'realtimeInterval' => 60,
    ],
];
```

This replaces the simple array above. The `dev` values apply only when `CRAFT_ENVIRONMENT` is `dev`; other environments use the shared values. Merge your own overrides into the appropriate array.

## Configuration Options

::: reference
### `pluginName`

**Type:** `string` · **Default:** `'Metrix'`

The name of the plugin as it appears in the Control Panel.
:::


::: reference
### `hasCpSection`

**Type:** `bool` · **Default:** `true`

Whether to enable Metrix in the main sidebar navigation.
:::


::: reference
### `enableCache`

**Type:** `bool` · **Default:** `true`

Whether to cache API requests.
:::


::: reference
### `cacheDuration`

**Type:** `string` · **Default:** `'PT10M'`

The cache duration for API requests as an [ISO 8601 duration string](https://www.php.net/manual/en/dateinterval.construct.php), such as `PT10M` for ten minutes or `PT1H` for one hour.
:::


::: reference
### `realtimeInterval`

**Type:** `int` · **Default:** `10`

The number of seconds between requests from Realtime widgets. Increase this interval when less frequent updates are sufficient or when you need to reduce requests to the provider.
:::


::: reference
### `defaultWidgetConfig`

**Type:** `array` · **Default:** `[]`

Default configuration for new widgets. When empty, Metrix uses a Line widget with `inheritPeriod` set to `true` and width `1`.
:::


::: reference
### `enabledWidgetTypes`

**Type:** `array|string` · **Default:** `'*'`

Choose which chart types editors can create. Use `'*'` for all registered types, or an array of Widget class names. For example, allow counters and line charts in `config/metrix.php`:

```php
return [
    'enabledWidgetTypes' => [
        \verbb\metrix\widgets\Counter::class,
        \verbb\metrix\widgets\Line::class,
    ],
];
```

Add the setting to your existing configuration array, then open the new-widget form and check the chart-type choices.
:::


::: reference
### `enabledPeriods`

**Type:** `array` · **Default:** `[]`

Choose which date ranges appear and how they are grouped. Supply an array of groups, with Period class names inside each group. For example:

```php
return [
    'enabledPeriods' => [
        [
            \verbb\metrix\periods\Today::class,
            \verbb\metrix\periods\Yesterday::class,
        ],
        [
            \verbb\metrix\periods\Last7Days::class,
            \verbb\metrix\periods\Last30Days::class,
        ],
    ],
];
```

This puts the two individual days in one group and the longer ranges in another. It overrides `periodSettings` when non-empty. Leave it empty to use the control-panel period settings, or all registered periods when neither setting is configured. Check the dashboard date-range menu after changing it.
:::


::: reference
### `periodSettings`

**Type:** `array` · **Default:** `[]`

The period order and enabled state saved by the control panel. Use `enabledPeriods` for a shorter PHP configuration, or supply rows with exact `id` and `enabled` keys when you need the same format as the control panel:

```php
return [
    'periodSettings' => [
        ['id' => \verbb\metrix\periods\Last7Days::class, 'enabled' => true],
        ['id' => \verbb\metrix\periods\Last30Days::class, 'enabled' => true],
    ],
];
```

Unlisted periods are hidden when rows are supplied. A non-empty `enabledPeriods` value takes precedence over these rows.
:::


## Control Panel
You can also manage configuration settings through the Control Panel by visiting Settings → Metrix.
