<?php

declare(strict_types=1);

use Tests\Support\AdminUser;
use Tests\Support\CpRequestContext;
use craft\web\View;
use verbb\metrix\Metrix;
use verbb\metrix\controllers\PresetsController;
use verbb\metrix\services\Sources;
use verbb\metrix\models\Preset;
use verbb\metrix\widgets\Counter;

beforeEach(function() {
    $this->formTransaction = Craft::$app->getDb()->beginTransaction();
    $this->formSources = Metrix::$plugin->getSources();
    $this->formController = Craft::$app->controller;
    $this->formTemplateMode = Craft::$app->getView()->getTemplateMode();
    Craft::$app->getView()->setTemplateMode(View::TEMPLATE_MODE_CP);
    $this->formTwig = Craft::$app->getView()->getTwig();
    $this->formLoader = $this->formTwig->getLoader();
    $this->formTwig->setLoader(new \Twig\Loader\ChainLoader([
        new \Twig\Loader\ArrayLoader(['audit-form-layout' => '{% block content %}{% endblock %}']),
        $this->formLoader,
    ]));
    Metrix::$plugin->set('sources', new Sources());
    Craft::$app->getDb()->createCommand()->update('{{%metrix_sources}}', ['enabled' => false])->execute();
    Craft::$app->controller = new PresetsController('presets', Metrix::$plugin);
});

afterEach(function() {
    $this->formTransaction->rollBack();
    Metrix::$plugin->set('sources', $this->formSources);
    Craft::$app->controller = $this->formController;
    $this->formTwig->setLoader($this->formLoader);
    Craft::$app->getView()->setTemplateMode($this->formTemplateMode);
});

it('preserves stored preset widgets in the form when no source is available', function() {
    AdminUser::login();
    CpRequestContext::activate('metrix/settings/presets/new', 'GET');
    $preset = new Preset(['name' => 'Audit form', 'handle' => 'auditForm', 'widgets' => [
        ['type' => Counter::class, 'canonicalMetric' => 'visitors', 'width' => 1],
    ]]);
    $html = Craft::$app->getView()->renderTemplate('metrix/settings/presets/_edit', [
        'parentLayout' => 'audit-form-layout',
        'preset' => $preset,
        'isNewPreset' => true,
        'baseUrl' => 'metrix/settings/presets',
        'continueEditingUrl' => 'metrix/settings/presets/edit/{id}',
        'hasSource' => false,
    ], View::TEMPLATE_MODE_CP);
    $document = new DOMDocument();
    @$document->loadHTML($html);
    $input = (new DOMXPath($document))->query('//input[@name="widgets"]')->item(0);
    $widgets = json_decode($input->getAttribute('value'), true);

    expect($widgets)->toHaveCount(1)->and($widgets[0]['canonicalMetric'])->toBe('visitors');
});
