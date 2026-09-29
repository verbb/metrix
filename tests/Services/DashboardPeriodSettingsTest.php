<?php

declare(strict_types=1);

use Tests\Support\AdminUser;
use Tests\Support\CpRequestContext;
use verbb\metrix\Metrix;
use verbb\metrix\controllers\DashboardController;
use verbb\metrix\periods\Today;

it('passes only enabled periods to the dashboard', function(string $setting) {
    AdminUser::login();
    CpRequestContext::activate('metrix', 'GET');
    $settings = Metrix::$plugin->getSettings();
    $originalPeriods = $settings->enabledPeriods;
    $originalRows = $settings->periodSettings;
    $view = Craft::$app->getView();
    $originalJs = $view->js;
    $view->js = [];

    try {
        $settings->enabledPeriods = $setting === 'config' ? [[Today::class]] : [];
        $settings->periodSettings = $setting === 'rows' ? [['id' => Today::class, 'enabled' => true]] : [];
        $controller = new class('dashboard', Metrix::$plugin) extends DashboardController {
            public function renderTemplate(string $template, array $variables = [], ?string $templateMode = null): \yii\web\Response
            {
                return new \craft\web\Response();
            }
        };
        $controller->actionIndex();
        $scripts = implode("\n", array_merge(...array_values($view->js)));
        preg_match('/new Craft\.Metrix\.Dashboard\((.*)\);/', $scripts, $match);
        $data = json_decode($match[1], true, flags: JSON_THROW_ON_ERROR);

        expect(array_column(array_merge(...$data['periodOptions']), 'value'))->toBe([Today::class]);
    } finally {
        $settings->enabledPeriods = $originalPeriods;
        $settings->periodSettings = $originalRows;
        $view->js = $originalJs;
    }
})->with(['config', 'rows']);

it('omits disabled dividers from the dashboard period groups', function() {
    $settings = new \verbb\metrix\models\Settings(['periodSettings' => [
        ['id' => Today::class, 'enabled' => true],
        ['id' => 'divider0', 'enabled' => false],
        ['id' => \verbb\metrix\periods\Last7Days::class, 'enabled' => true],
    ]]);
    expect($settings->getEnabledPeriods())->toBe([[Today::class, \verbb\metrix\periods\Last7Days::class]]);
});
