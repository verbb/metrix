# Events
Metrix provides a collection of events for extending its functionality. Modules and plugins can register event listeners, typically in their `init()` methods, to modify Metrix’s behaviour.

## Source Events

### The `beforeSaveSource` Event
The event that is triggered before a source is saved.

```php
use verbb\metrix\events\SourceEvent;
use verbb\metrix\services\Sources;
use yii\base\Event;

Event::on(Sources::class, Sources::EVENT_BEFORE_SAVE_SOURCE, function(SourceEvent $event) {
    $source = $event->source;
    $isNew = $event->isNew;
    \Craft::info(($isNew ? 'Creating' : 'Updating') . " Metrix Source {$source->handle}.", __METHOD__);
});
```

### The `afterSaveSource` Event
The event that is triggered after a source is saved.

```php
use verbb\metrix\events\SourceEvent;
use verbb\metrix\services\Sources;
use yii\base\Event;

Event::on(Sources::class, Sources::EVENT_AFTER_SAVE_SOURCE, function(SourceEvent $event) {
    $source = $event->source;
    $isNew = $event->isNew;
    \Craft::info(($isNew ? 'Created' : 'Updated') . " Metrix Source {$source->handle}.", __METHOD__);
});
```

### The `beforeDeleteSource` Event
The event that is triggered before a source is deleted.

```php
use verbb\metrix\events\SourceEvent;
use verbb\metrix\services\Sources;
use yii\base\Event;

Event::on(Sources::class, Sources::EVENT_BEFORE_DELETE_SOURCE, function(SourceEvent $event) {
    $source = $event->source;
    \Craft::info("Preparing to delete Metrix Source {$source->handle}.", __METHOD__);
});
```

### The `afterDeleteSource` Event
The event that is triggered after a source is deleted.

```php
use verbb\metrix\events\SourceEvent;
use verbb\metrix\services\Sources;
use yii\base\Event;

Event::on(Sources::class, Sources::EVENT_AFTER_DELETE_SOURCE, function(SourceEvent $event) {
    $source = $event->source;
    \Craft::info("Deleted Metrix Source {$source->handle}.", __METHOD__);
});
```

## View Events

### The `beforeSaveView` Event
The event that is triggered before a view is saved.

```php
use verbb\metrix\events\ViewEvent;
use verbb\metrix\services\Views;
use yii\base\Event;

Event::on(Views::class, Views::EVENT_BEFORE_SAVE_VIEW, function(ViewEvent $event) {
    $view = $event->view;
    $isNew = $event->isNew;
    \Craft::info(($isNew ? 'Creating' : 'Updating') . " Metrix View {$view->handle}.", __METHOD__);
});
```

### The `afterSaveView` Event
The event that is triggered after a view is saved.

```php
use verbb\metrix\events\ViewEvent;
use verbb\metrix\services\Views;
use yii\base\Event;

Event::on(Views::class, Views::EVENT_AFTER_SAVE_VIEW, function(ViewEvent $event) {
    $view = $event->view;
    $isNew = $event->isNew;
    \Craft::info(($isNew ? 'Created' : 'Updated') . " Metrix View {$view->handle}.", __METHOD__);
});
```

### The `beforeDeleteView` Event
The event that is triggered before a view is deleted.

```php
use verbb\metrix\events\ViewEvent;
use verbb\metrix\services\Views;
use yii\base\Event;

Event::on(Views::class, Views::EVENT_BEFORE_DELETE_VIEW, function(ViewEvent $event) {
    $view = $event->view;
    \Craft::info("Preparing to delete Metrix View {$view->handle}.", __METHOD__);
});
```

### The `afterDeleteView` Event
The event that is triggered after a view is deleted.

```php
use verbb\metrix\events\ViewEvent;
use verbb\metrix\services\Views;
use yii\base\Event;

Event::on(Views::class, Views::EVENT_AFTER_DELETE_VIEW, function(ViewEvent $event) {
    $view = $event->view;
    \Craft::info("Deleted Metrix View {$view->handle}.", __METHOD__);
});
```

## Preset Events

### The `beforeSavePreset` Event
The event that is triggered before a preset is saved.

```php
use verbb\metrix\events\PresetEvent;
use verbb\metrix\services\Presets;
use yii\base\Event;

Event::on(Presets::class, Presets::EVENT_BEFORE_SAVE_PRESET, function(PresetEvent $event) {
    $preset = $event->preset;
    $isNew = $event->isNew;
    \Craft::info(($isNew ? 'Creating' : 'Updating') . " Metrix Preset {$preset->handle}.", __METHOD__);
});
```

### The `afterSavePreset` Event
The event that is triggered after a preset is saved.

```php
use verbb\metrix\events\PresetEvent;
use verbb\metrix\services\Presets;
use yii\base\Event;

Event::on(Presets::class, Presets::EVENT_AFTER_SAVE_PRESET, function(PresetEvent $event) {
    $preset = $event->preset;
    $isNew = $event->isNew;
    \Craft::info(($isNew ? 'Created' : 'Updated') . " Metrix Preset {$preset->handle}.", __METHOD__);
});
```

### The `beforeDeletePreset` Event
The event that is triggered before a preset is deleted.

```php
use verbb\metrix\events\PresetEvent;
use verbb\metrix\services\Presets;
use yii\base\Event;

Event::on(Presets::class, Presets::EVENT_BEFORE_DELETE_PRESET, function(PresetEvent $event) {
    $preset = $event->preset;
    \Craft::info("Preparing to delete Metrix Preset {$preset->handle}.", __METHOD__);
});
```

### The `afterDeletePreset` Event
The event that is triggered after a preset is deleted.

```php
use verbb\metrix\events\PresetEvent;
use verbb\metrix\services\Presets;
use yii\base\Event;

Event::on(Presets::class, Presets::EVENT_AFTER_DELETE_PRESET, function(PresetEvent $event) {
    $preset = $event->preset;
    \Craft::info("Deleted Metrix Preset {$preset->handle}.", __METHOD__);
});
```

## Widget Events

### The `beforeSaveWidget` Event
The event that is triggered before a widget is saved.

```php
use verbb\metrix\events\WidgetEvent;
use verbb\metrix\services\Widgets;
use yii\base\Event;

Event::on(Widgets::class, Widgets::EVENT_BEFORE_SAVE_WIDGET, function(WidgetEvent $event) {
    $widget = $event->widget;
    $isNew = $event->isNew;
    \Craft::info(($isNew ? 'Creating' : 'Updating') . ' Metrix Widget ' . get_class($widget) . '.', __METHOD__);
});
```

### The `afterSaveWidget` Event
The event that is triggered after a widget is saved.

```php
use verbb\metrix\events\WidgetEvent;
use verbb\metrix\services\Widgets;
use yii\base\Event;

Event::on(Widgets::class, Widgets::EVENT_AFTER_SAVE_WIDGET, function(WidgetEvent $event) {
    $widget = $event->widget;
    $isNew = $event->isNew;
    \Craft::info(($isNew ? 'Created' : 'Updated') . ' Metrix Widget ' . get_class($widget) . '.', __METHOD__);
});
```

### The `beforeDeleteWidget` Event
The event that is triggered before a widget is deleted.

```php
use verbb\metrix\events\WidgetEvent;
use verbb\metrix\services\Widgets;
use yii\base\Event;

Event::on(Widgets::class, Widgets::EVENT_BEFORE_DELETE_WIDGET, function(WidgetEvent $event) {
    $widget = $event->widget;
    \Craft::info('Preparing to delete Metrix Widget ' . get_class($widget) . '.', __METHOD__);
});
```

### The `afterDeleteWidget` Event
The event that is triggered after a widget is deleted.

```php
use verbb\metrix\events\WidgetEvent;
use verbb\metrix\services\Widgets;
use yii\base\Event;

Event::on(Widgets::class, Widgets::EVENT_AFTER_DELETE_WIDGET, function(WidgetEvent $event) {
    $widget = $event->widget;
    \Craft::info('Deleted Metrix Widget ' . get_class($widget) . '.', __METHOD__);
});
```
