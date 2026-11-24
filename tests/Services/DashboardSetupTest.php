<?php

declare(strict_types=1);

use verbb\metrix\Metrix;
use verbb\metrix\helpers\DashboardSetup;
use verbb\metrix\models\View;
use verbb\metrix\services\Sources;
use verbb\metrix\services\Views;
use verbb\metrix\services\Widgets;
use verbb\metrix\sources\Plausible;
use verbb\metrix\widgets\Counter;

use craft\db\Table;
use craft\services\Plugins;

beforeEach(function() {
    $this->setupInstallDate = Craft::$app->getPlugins()->getStoredPluginInfo('metrix')['installDate'] ?? null;
    $this->setupTransaction = Craft::$app->getDb()->beginTransaction();
    $this->setupServices = [];

    // Start from a dashboard that has never had a source or widget.
    Craft::$app->getDb()->createCommand()->delete('{{%metrix_widgets}}')->execute();
    Craft::$app->getDb()->createCommand()->delete('{{%metrix_sources}}')->execute();
    Craft::$app->getDb()->createCommand()->delete(Table::SEQUENCES, ['name' => Widgets::WIDGETS_ADDED_SEQUENCE])->execute();

    foreach (['sources' => Sources::class, 'views' => Views::class, 'widgets' => Widgets::class] as $key => $class) {
        $this->setupServices[$key] = Metrix::$plugin->get($key);
        Metrix::$plugin->set($key, new $class());
    }

    // Setup only shows on installs made since the checklist was added.
    dashboardSetupInstallDate(new DateTime('now', new DateTimeZone('UTC')));

    $suffix = bin2hex(random_bytes(5));
    $this->setupSuffix = $suffix;
    $this->setupView = new View(['name' => 'View ' . $suffix, 'handle' => 'view' . $suffix]);
    Metrix::$plugin->getViews()->saveView($this->setupView);
});

afterEach(function() {
    $this->setupTransaction->rollBack();
    dashboardSetupInstallDate($this->setupInstallDate);

    foreach ($this->setupServices as $key => $service) {
        Metrix::$plugin->set($key, $service);
    }
});

// Craft keeps each plugin's stored info in memory, so this changes the install date the setup check reads without
// writing to the plugins table.
function dashboardSetupInstallDate(?DateTime $date): void
{
    $plugins = Craft::$app->getPlugins();
    $plugins->getStoredPluginInfo('metrix');

    $property = new ReflectionProperty(Plugins::class, '_storedPluginInfo');
    $info = $property->getValue($plugins);

    $info['metrix']['installDate'] = $date;

    $property->setValue($plugins, $info);
}

function dashboardSetupSource(string $suffix, array $cache = []): Plausible
{
    $source = new Plausible([
        'name' => 'Source ' . $suffix,
        'handle' => 'source' . $suffix,
        'enabled' => true,
        'apiKey' => 'fixture-key',
        'siteId' => 'example.test',
    ]);

    expect(Metrix::$plugin->getSources()->saveSource($source))->toBeTrue();

    if ($cache) {
        // A cached connection only counts for the settings it was checked with.
        $cache['_settingsKey'] = $source->getCacheKey();
        Craft::$app->getDb()->createCommand()->update('{{%metrix_sources}}', ['cache' => json_encode($cache)], ['id' => $source->id])->execute();
        Metrix::$plugin->set('sources', new Sources());
    }

    return Metrix::$plugin->getSources()->getSourceById($source->id);
}

it('starts with every step to do', function() {
    $steps = DashboardSetup::getSteps();

    expect($steps['source']['done'])->toBeFalse()
        ->and($steps['connect']['done'])->toBeFalse()
        ->and($steps['widgets']['done'])->toBeFalse();
});

it('ticks the source step and names the source still to connect', function() {
    $source = dashboardSetupSource($this->setupSuffix);
    $steps = DashboardSetup::getSteps();

    expect($steps['source']['done'])->toBeTrue()
        ->and($steps['connect']['done'])->toBeFalse()
        ->and($steps['connect']['sourceName'])->toBe($source->name);
});

it('ticks the connect step once a source is connected', function() {
    dashboardSetupSource($this->setupSuffix, ['connection' => 'success']);

    expect(DashboardSetup::getSteps()['connect']['done'])->toBeTrue();
});

it('ends setup at the first widget and stays ended after it is deleted', function() {
    $widget = new Counter();
    $widget->setSource(dashboardSetupSource($this->setupSuffix, ['connection' => 'success']));
    $widget->setView($this->setupView);

    expect(Metrix::$plugin->getWidgets()->saveWidget($widget))->toBeTrue()
        ->and(DashboardSetup::getSteps())->toBeNull();

    Metrix::$plugin->getWidgets()->deleteWidget($widget);
    Metrix::$plugin->set('widgets', new Widgets());

    expect(Metrix::$plugin->getWidgets()->getAllWidgets())->toBe([])
        ->and(DashboardSetup::getSteps())->toBeNull();
});

it('never shows on installs from before the checklist was added', function() {
    dashboardSetupInstallDate(new DateTime('2026-11-22 23:59:59', new DateTimeZone('UTC')));

    expect(DashboardSetup::getSteps())->toBeNull();
});

it('treats an install with no recorded date as an existing install', function() {
    dashboardSetupInstallDate(null);

    expect(DashboardSetup::getSteps())->toBeNull();
});
