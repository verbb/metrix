<?php

declare(strict_types=1);

use verbb\metrix\Metrix;
use verbb\metrix\models\View;
use verbb\metrix\services\Sources;
use verbb\metrix\services\Views;
use verbb\metrix\services\Widgets;
use verbb\metrix\sources\Plausible;
use verbb\metrix\widgets\Counter;

beforeEach(function() {
    $this->mutationTransaction = Craft::$app->getDb()->beginTransaction();
    $this->mutationServices = [];
    foreach (['sources' => Sources::class, 'views' => Views::class, 'widgets' => Widgets::class] as $key => $class) {
        $this->mutationServices[$key] = Metrix::$plugin->get($key);
        Metrix::$plugin->set($key, new $class());
    }
    $suffix = bin2hex(random_bytes(5));
    $this->mutationSource = new Plausible(['name' => 'Source ' . $suffix, 'handle' => 'source' . $suffix, 'enabled' => false]);
    $this->mutationView = new View(['name' => 'View ' . $suffix, 'handle' => 'view' . $suffix]);
    Metrix::$plugin->getSources()->saveSource($this->mutationSource);
    Metrix::$plugin->getViews()->saveView($this->mutationView);
    $this->mutationWidget = new Counter();
    $this->mutationWidget->setSource($this->mutationSource);
    $this->mutationWidget->setView($this->mutationView);
    Metrix::$plugin->getWidgets()->saveWidget($this->mutationWidget);
});

afterEach(function() {
    $this->mutationTransaction->rollBack();
    foreach ($this->mutationServices as $key => $service) {
        Metrix::$plugin->set($key, $service);
    }
});

it('makes saved sources visible after the source list has been read', function() {
    $service = Metrix::$plugin->getSources();
    $service->getAllSources();
    $source = new Plausible(['name' => 'New ' . $this->mutationSource->name, 'handle' => 'new' . $this->mutationSource->handle, 'enabled' => false]);
    expect($service->saveSource($source))->toBeTrue();
    expect($service->getSourceById($source->id)?->handle)->toBe($source->handle);
});

it('exposes the completed deletion to widget event listeners', function() {
    $service = Metrix::$plugin->getWidgets();
    $service->getAllWidgets();
    $observed = false;
    $service->on(Widgets::EVENT_AFTER_DELETE_WIDGET, function($event) use ($service, &$observed) {
        $observed = $service->getWidgetById($event->widget->id);
    });

    $service->deleteWidget($this->mutationWidget);

    expect($observed)->toBeNull();
});

it('returns fresh settings after a source is edited through a separate instance', function() {
    $service = Metrix::$plugin->getSources();
    $service->getAllSources();
    $source = clone $this->mutationSource;
    $source->siteId = 'updated.invalid';
    $service->saveSource($source);

    expect($service->getSourceById($source->id)->siteId)->toBe('updated.invalid');
});

it('returns reordered records immediately', function(string $key, string $getter, string $reorder, string $fixture) {
    $service = Metrix::$plugin->get($key);
    $first = $this->$fixture;
    if ($key === 'widgets') {
        $second = new Counter();
        $second->setSource($this->mutationSource);
        $second->setView($this->mutationView);
        $service->saveWidget($second);
    } else {
        $second = clone $first;
        $second->id = null;
        $second->uid = null;
        $second->name .= ' second';
        $second->handle .= 'Second';
        $save = $key === 'sources' ? 'saveSource' : 'saveView';
        $service->$save($second);
    }
    $service->$getter();
    $service->$reorder([$second->id, $first->id]);
    $ids = array_map(fn($item) => $item->id, $service->$getter());
    $ids = array_values(array_filter($ids, fn($id) => in_array($id, [$first->id, $second->id])));

    expect($ids)->toBe([$second->id, $first->id]);
})->with([
    ['sources', 'getAllSources', 'reorderSources', 'mutationSource'],
    ['views', 'getAllViews', 'reorderViews', 'mutationView'],
    ['widgets', 'getAllWidgets', 'reorderWidgets', 'mutationWidget'],
]);

it('removes cascaded widgets from the service cache when their parent is deleted', function(string $parent) {
    $widgets = Metrix::$plugin->getWidgets();
    expect($widgets->getWidgetById($this->mutationWidget->id))->not->toBeNull();
    if ($parent === 'source') {
        Metrix::$plugin->getSources()->deleteSource($this->mutationSource);
    } else {
        Metrix::$plugin->getViews()->deleteView($this->mutationView);
    }

    expect($widgets->getWidgetById($this->mutationWidget->id))->toBeNull();
})->with(['source', 'view']);

it('refreshes cached widget relations after their parent settings change', function(string $parent) {
    $widgets = Metrix::$plugin->getWidgets();
    $widget = $widgets->getWidgetById($this->mutationWidget->id);
    if ($parent === 'source') {
        $widget->getSource();
        $source = clone $this->mutationSource;
        $source->siteId = 'updated.invalid';
        Metrix::$plugin->getSources()->saveSource($source);
        expect($widgets->getWidgetById($widget->id)->getSource()->siteId)->toBe('updated.invalid');
    } else {
        $widget->getView();
        $view = clone $this->mutationView;
        $view->name = 'Updated ' . $view->name;
        Metrix::$plugin->getViews()->saveView($view);
        expect($widgets->getWidgetById($widget->id)->getView()->name)->toBe($view->name);
    }
})->with(['source', 'view']);
