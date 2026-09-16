# Custom Widget
Create a custom Widget when a different presentation would help your team interpret its analytics. This example displays a date range as a grid of values: darker cells indicate higher activity. Each cell includes its date and number, so colour is not the only way to read the result.

Start with a bootstrapped [Craft module](https://craftcms.com/docs/5.x/extend/module-guide.html) using `modules\sitemodule`, a connected analytics Source and a working Line widget. Use the same Source and metric to verify this example. The JavaScript build below needs Node.js compatible with Vite.

Create the three PHP files below beside your module's `Module.php`. Add these imports at the top of `Module.php`, then place the listener inside `init()`, after `parent::init()`. The registration snippet is partial module code:

```php
use craft\events\RegisterComponentTypesEvent;
use modules\sitemodule\Heatmap;
use verbb\metrix\services\Widgets;
use yii\base\Event;

Event::on(Widgets::class, Widgets::EVENT_REGISTER_WIDGET_TYPES, function(RegisterComponentTypesEvent $event) {
    $event->types[] = Heatmap::class;
});
```

## Example Widget
After registering the Widget with `Widgets::EVENT_REGISTER_WIDGET_TYPES`, create `Heatmap.php` in the module namespace. The class identifies its data transformer, settings fields and asset bundle:

```php
<?php
namespace modules\sitemodule;

use verbb\metrix\base\Widget;
use verbb\metrix\helpers\Schema;

use Craft;

class Heatmap extends Widget
{
    // Static Methods
    // =========================================================================

    public static function displayName(): string
    {
        return Craft::t('metrix', 'Heatmap');
    }

    public static function getDataType(): string
    {
        return HeatmapData::class;
    }

    public static function getSettingsSchema(): array
    {
        return [
            Schema::sources(),
            Schema::chartTypes(),
            Schema::titles(),
            Schema::widths(),
            Schema::periods(),
            Schema::metrics(),
        ];
    }

    public static function getAssetBundle(): ?string
    {
        return HeatmapAsset::class;
    }
}
```

`getSettingsSchema()` returns the fields shown when an editor configures the Widget. The classes returned by `getDataType()` and `getAssetBundle()` are defined below in the same module namespace.

## Widget Data
Create `HeatmapData.php` to transform the provider response into the rows required by the component:

```php
<?php
namespace modules\sitemodule;

use verbb\metrix\base\WidgetData;

use Craft;

use DateTime;

class HeatmapData extends WidgetData
{
    // Protected Methods
    // =========================================================================

    protected function formatData(array $rawData): array
    {
        $rows = [];
        $now = new DateTime();

        // Generate all possible dimensions for the current period
        foreach ($this->period::generatePlotDimensions($this, $rawData) as $dimension) {
            $defaultValue = new DateTime($dimension) < $now ? 0 : null;

            $rows[] = [
                'dimension' => $dimension,
                'value' => $rawData[$dimension] ?? $defaultValue,
            ];
        }

        // Sort rows to ensure proper heatmap rendering
        usort($rows, function ($a, $b) {
            return strcmp($a['dimension'], $b['dimension']);
        });

        return [
            'cols' => [
                [
                    'type' => 'date',
                    'label' => Craft::t('metrix', 'Date'),
                ],
                [
                    'type' => 'number',
                    'label' => $this->widget->getMetricLabel(),
                ],
            ],
            'rows' => $rows,
        ];
    }
}
```

## Asset Bundle
Create `HeatmapAsset.php` to publish the compiled JavaScript:

```php
<?php
namespace modules\sitemodule;

use verbb\metrix\web\assets\src\CpReactAsset;

use craft\web\AssetBundle;

class HeatmapAsset extends AssetBundle
{
    // Public Methods
    // =========================================================================

    public function init(): void
    {
        $this->sourcePath = __DIR__ . '/widgets/dist';

        $this->depends = [
            CpReactAsset::class,
        ];

        $this->js = [
            'main.js',
        ];

        parent::init();
    }
}
```

## JavaScript

Create `widgets/src/HeatmapWidget.js` under your module directory. The component receives Metrix's Widget props and uses `WidgetLarge` for the header, loading state and error handling. Its `renderContent` callback receives the data returned by `HeatmapData::formatData()`:

```js
import { createElement as h } from 'react';

export function HeatmapWidget(props) {
    const { WidgetLarge } = window.Craft.Metrix.SharedComponents;

    function renderContent(data) {
        const maximum = Math.max(1, ...data.rows.map(row => Number(row.value) || 0));

        return h('ul', {
            'aria-label': 'Activity by date',
            style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
                gap: '8px',
                padding: '16px',
                margin: 0,
                listStyle: 'none',
                overflow: 'auto',
            },
        }, data.rows.map(row => {
            const value = row.value === null ? 'No data' : String(row.value);
            const intensity = Math.max(0, Math.min(1, Number(row.value) / maximum));

            return h('li', {
                key: row.dimension,
                style: {
                    padding: '10px',
                    borderRadius: '4px',
                    background: `rgba(29, 78, 216, ${0.08 + intensity * 0.2})`,
                    color: 'inherit',
                },
            }, [
                h('time', { key: 'date', dateTime: row.dimension }, row.dimension),
                h('strong', { key: 'value', style: { display: 'block' } }, value),
            ]);
        }));
    }

    return h(WidgetLarge, { ...props, renderContent });
}

HeatmapWidget.meta = { name: 'Heatmap' };
```

Create `widgets/src/main.js` beside it. Register the component immediately if Metrix is ready, or listen for its configuration event. The registration key must match the PHP class name:

```js
import { HeatmapWidget } from './HeatmapWidget.js';

function registerHeatmap() {
    window.Craft.Metrix.Config.registerWidget('modules\\sitemodule\\Heatmap', HeatmapWidget);
}

if (window.Craft?.Metrix?.Config) {
    registerHeatmap();
}

document.addEventListener('onMetrixConfigReady', registerHeatmap);
```

## Build the Asset

Create `widgets/package.json`. The component uses React 19, matching Metrix's React runtime. It creates elements without introducing a second React root:

```json
{
    "private": true,
    "type": "module",
    "scripts": { "build": "vite build" },
    "dependencies": { "react": "^19.2.5" },
    "devDependencies": { "vite": "^8.0.10" }
}
```

Create `widgets/vite.config.js` to bundle those imports into the `dist/main.js` file published by `HeatmapAsset`:

```js
import { defineConfig } from 'vite';

export default defineConfig({
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    build: {
        lib: {
            entry: 'src/main.js',
            name: 'MetrixHeatmap',
            formats: ['iife'],
            fileName: () => 'main.js',
        },
    },
});
```

In a terminal, change to this `widgets` directory, install its dependencies and build:

```shell
cd /path/to/project/modules/sitemodule/widgets
npm install
npm run build
```

Commit the built asset with your module or build it during deployment. `HeatmapAsset` must be able to find `widgets/dist/main.js` on the server.

## Verify the Widget

Reload the Metrix dashboard and add a **Heatmap** widget to a test View. Select the same Source, metric and **Last 7 Days** period as your working Line widget. Save it and compare the date buckets and values. The grid should show the same numbers, with the largest values using the darkest background.

Change the period and refresh the widget. Check that a zero appears as `0`, a future bucket appears as “No data”, and a provider error appears in Metrix's error state. When updating the built script, clear Craft's published asset caches if the browser still loads an older copy.
