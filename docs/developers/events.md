# Events
Metrix provides a collection of events for extending its functionality. Modules and plugins can register event listeners, typically in their `init()` methods, to modify Metrix’s behavior.

## Source Events

### The `beforeSaveSource` event
The event that is triggered before a source is saved.

```php
use verbb\metrix\events\SourceEvent;
use verbb\metrix\services\Sources;
use yii\base\Event;

Event::on(Sources::class, Sources::EVENT_BEFORE_SAVE_SOURCE, function(SourceEvent $event) {
    $source = $event->source;
    $isNew = $event->isNew;
    // ...
});
```

### The `afterSaveSource` event
The event that is triggered after a source is saved.

```php
use verbb\metrix\events\SourceEvent;
use verbb\metrix\services\Sources;
use yii\base\Event;

Event::on(Sources::class, Sources::EVENT_AFTER_SAVE_SOURCE, function(SourceEvent $event) {
    $source = $event->source;
    $isNew = $event->isNew;
    // ...
});
```

### The `beforeDeleteSource` event
The event that is triggered before a source is deleted.

```php
use verbb\metrix\events\SourceEvent;
use verbb\metrix\services\Sources;
use yii\base\Event;

Event::on(Sources::class, Sources::EVENT_BEFORE_DELETE_SOURCE, function(SourceEvent $event) {
    $source = $event->source;
    // ...
});
```

### The `afterDeleteSource` event
The event that is triggered after a source is deleted.

```php
use verbb\metrix\events\SourceEvent;
use verbb\metrix\services\Sources;
use yii\base\Event;

Event::on(Sources::class, Sources::EVENT_AFTER_DELETE_SOURCE, function(SourceEvent $event) {
    $source = $event->source;
    // ...
});
```

## View Events

### The `beforeSaveView` event
The event that is triggered before a view is saved.

```php
use verbb\metrix\events\ViewEvent;
use verbb\metrix\services\Views;
use yii\base\Event;

Event::on(Views::class, Views::EVENT_BEFORE_SAVE_SOURCE, function(ViewEvent $event) {
    $view = $event->view;
    $isNew = $event->isNew;
    // ...
});
```

### The `afterSaveView` event
The event that is triggered after a view is saved.

```php
use verbb\metrix\events\ViewEvent;
use verbb\metrix\services\Views;
use yii\base\Event;

Event::on(Views::class, Views::EVENT_AFTER_SAVE_SOURCE, function(ViewEvent $event) {
    $view = $event->view;
    $isNew = $event->isNew;
    // ...
});
```

### The `beforeDeleteView` event
The event that is triggered before a view is deleted.

```php
use verbb\metrix\events\ViewEvent;
use verbb\metrix\services\Views;
use yii\base\Event;

Event::on(Views::class, Views::EVENT_BEFORE_DELETE_SOURCE, function(ViewEvent $event) {
    $view = $event->view;
    // ...
});
```

### The `afterDeleteView` event
The event that is triggered after a view is deleted.

```php
use verbb\metrix\events\ViewEvent;
use verbb\metrix\services\Views;
use yii\base\Event;

Event::on(Views::class, Views::EVENT_AFTER_DELETE_SOURCE, function(ViewEvent $event) {
    $view = $event->view;
    // ...
});
```

## Preset Events

### The `beforeSavePreset` event
The event that is triggered before a preset is saved.

```php
use verbb\metrix\events\PresetEvent;
use verbb\metrix\services\Presets;
use yii\base\Event;

Event::on(Presets::class, Presets::EVENT_BEFORE_SAVE_SOURCE, function(PresetEvent $event) {
    $preset = $event->preset;
    $isNew = $event->isNew;
    // ...
});
```

### The `afterSavePreset` event
The event that is triggered after a preset is saved.

```php
use verbb\metrix\events\PresetEvent;
use verbb\metrix\services\Presets;
use yii\base\Event;

Event::on(Presets::class, Presets::EVENT_AFTER_SAVE_SOURCE, function(PresetEvent $event) {
    $preset = $event->preset;
    $isNew = $event->isNew;
    // ...
});
```

### The `beforeDeletePreset` event
The event that is triggered before a preset is deleted.

```php
use verbb\metrix\events\PresetEvent;
use verbb\metrix\services\Presets;
use yii\base\Event;

Event::on(Presets::class, Presets::EVENT_BEFORE_DELETE_SOURCE, function(PresetEvent $event) {
    $preset = $event->preset;
    // ...
});
```

### The `afterDeletePreset` event
The event that is triggered after a preset is deleted.

```php
use verbb\metrix\events\PresetEvent;
use verbb\metrix\services\Presets;
use yii\base\Event;

Event::on(Presets::class, Presets::EVENT_AFTER_DELETE_SOURCE, function(PresetEvent $event) {
    $preset = $event->preset;
    // ...
});
```

## Widget Events

### The `beforeSaveWidget` event
The event that is triggered before a widget is saved.

```php
use verbb\metrix\events\WidgetEvent;
use verbb\metrix\services\Widgets;
use yii\base\Event;

Event::on(Widgets::class, Widgets::EVENT_BEFORE_SAVE_SOURCE, function(WidgetEvent $event) {
    $widget = $event->widget;
    $isNew = $event->isNew;
    // ...
});
```

### The `afterSaveWidget` event
The event that is triggered after a widget is saved.

```php
use verbb\metrix\events\WidgetEvent;
use verbb\metrix\services\Widgets;
use yii\base\Event;

Event::on(Widgets::class, Widgets::EVENT_AFTER_SAVE_SOURCE, function(WidgetEvent $event) {
    $widget = $event->widget;
    $isNew = $event->isNew;
    // ...
});
```

### The `beforeDeleteWidget` event
The event that is triggered before a widget is deleted.

```php
use verbb\metrix\events\WidgetEvent;
use verbb\metrix\services\Widgets;
use yii\base\Event;

Event::on(Widgets::class, Widgets::EVENT_BEFORE_DELETE_SOURCE, function(WidgetEvent $event) {
    $widget = $event->widget;
    // ...
});
```

### The `afterDeleteWidget` event
The event that is triggered after a widget is deleted.

```php
use verbb\metrix\events\WidgetEvent;
use verbb\metrix\services\Widgets;
use yii\base\Event;

Event::on(Widgets::class, Widgets::EVENT_AFTER_DELETE_SOURCE, function(WidgetEvent $event) {
    $widget = $event->widget;
    // ...
});
```

