# Custom Widget
You can register your own Widget to add support for other types of widgets, or even extend an existing Widget

```php
namespace modules\sitemodule;

use craft\events\RegisterComponentTypesEvent;
use modules\sitemodule\MyWidget;
use verbb\metrix\services\Widgets;
use yii\base\Event;

Event::on(Widgets::class, Widgets::EVENT_REGISTER_WIDGET_TYPES, function(RegisterComponentTypesEvent $event) {
    $event->types[] = MyWidget::class;
});
```

## Example Widget
The first step is to register your widget as above with `Widgets::EVENT_REGISTER_WIDGET_TYPES`. Then, we'll need to define what type of data our widget uses, and what sort of settings it provides.

```php
<?php
namespace modules\sitemodule;

use verbb\metrix\Metrix;
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

The widget data will be covered in the next section, while the `getSettingsSchema()` needs to return a collection of field definitions. These define what fields are available as settings when editing the widget.

## Widget Data
Next is the widget data. Essentially, this handles transforming the raw data provided by the source into the structure for the widget. Any processing you need to do to the data, including formatting should go here.

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
You'll need to provide an asset bundle to serve your JS correctly.

```php
<?php
namespace modules\sitemodule;

use verbb\metrix\assetbundles\MetrixAsset;

use craft\web\AssetBundle;

class HeatmapAsset extends AssetBundle
{
    // Public Methods
    // =========================================================================

    public function init(): void
    {
        $this->sourcePath = '@modules/sitemodule/widgets/assets/dist';

        $this->depends = [
            MetrixAsset::class,
        ];

        $this->js = [
            'main.js',
        ];

        parent::init();
    }
}
```

## JavaScript
Finally, you'll need to provide a React component to be used when rendering the widget. It will be up to you to build this component, as we cannot use the raw React component with Metrix.

First, create a `main.js` file.

```js
import { HeatmapWidget } from './HeatmapWidget.jsx';

document.addEventListener('onMetrixConfigReady', (e) => {
    Craft.Metrix.Config.registerWidget('modules\\sitemodule\\widgets\\Heatmap', HeatmapWidget);
});
```

Then, in our `HeatmapWidget.jsx` file:

```js
export const HeatmapWidget = (props) => {
    const { WidgetLarge } = window.Craft.Metrix.SharedComponents;

    const { widget } = props;

    function renderContent(data) {
        return (
            <div className="mc-h-full mc-flex mc-flex-col mc-relative mc-pt-4">
                <div className="mc-relative mc-w-full" style={{ height: '25.3rem' }}>
                    // ...
                </div>
            </div>
        );
    }

    return <WidgetLarge className="mc-h-[29rem]" renderContent={renderContent} {...props} />;
}

HeatmapWidget.meta = {
    name: 'Heatmap',
};
```

Don't forget to build these JavaScript files with your favourite bundler!