# Configuration
Create a `metrix.php` file under your `/config` directory with the following options available to you. You can also use multi-environment options to change these per environment.

The below shows the defaults already used by Metrix, so you don't need to add these options unless you want to modify the values.

```php
<?php

return [
    '*' => [
        'pluginName' => 'Metrix',
        'hasCpSection' => true,
        'enableCache' => true,
        'cacheDuration' => 'PT10M',
        'realtimeInterval' => 10,
        'defaultWidgetConfig' => [
            'type' => 'verbb\\metrix\\widgets\\Line',
            'period' => 'verbb\\metrix\\periods\\Today',
            'width' => 1,
        ],
        'enabledWidgetTypes' => '*',
        'enabledPeriods' => [],
    ]
];
```

## Configuration options
- `pluginName` - The name of the plugin as it appears in the Control Panel.
- `hasCpSection` - Whether to enable Metrix in the main sidebar navigation.
- `enableCache` - Whether to cache API requests.
- `cacheDuration` - The cache duration for API requests. Accepts a [Date Interval](https://www.php.net/manual/en/dateinterval.construct.php) or a number of seconds.
- `realtimeInterval` - Number of seconds between requests for real-time data.
- `defaultWidgetConfig` - Default configuration for new widgets, including type, period, and width.
- `enabledWidgetTypes` - The widget types available to create. Use `'*'` to enable all widget types.
- `enabledPeriods` - The periods available for widgets, grouped as nested arrays.

## Control Panel
You can also manage configuration settings through the Control Panel by visiting Settings → Metrix.
