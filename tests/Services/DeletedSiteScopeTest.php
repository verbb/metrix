<?php

declare(strict_types=1);

use craft\models\Site;
use craft\services\Sites;
use verbb\metrix\base\WidgetDataInterface;
use verbb\metrix\models\View;
use verbb\metrix\periods\Last7Days;
use verbb\metrix\services\Views;
use verbb\metrix\sources\Plausible;
use verbb\metrix\widgets\Counter;

it('reports a deleted scoped site instead of requesting unfiltered traffic', function() {
    $transaction = Craft::$app->getDb()->beginTransaction();
    $originalSites = Craft::$app->getSites();
    $projectConfig = Craft::$app->getProjectConfig();
    $configVersion = Craft::$app->getInfo()->configVersion;
    Craft::$app->set('sites', $sites = new Sites());

    try {
        $site = new Site([
            'groupId' => $sites->getPrimarySite()->groupId,
            'name' => 'Deleted scope site', 'handle' => 'deletedScopeSite',
            'language' => 'en-US', 'hasUrls' => true, 'baseUrl' => 'https://example.test/fr/',
        ]);
        expect($sites->saveSite($site))->toBeTrue();
        $view = new View(['name' => 'Deleted site view', 'handle' => 'deletedSiteView']);
        $view->setAnalyticsScope(['mode' => 'craftSite', 'craftSiteId' => $site->id]);
        expect((new Views())->saveView($view))->toBeTrue();
        expect($sites->deleteSite($site))->toBeTrue();
        $view = (new Views())->getViewById($view->id);
        expect($view->getAnalyticsScope()->getCraftSite())->toBeNull();

        $source = new class extends Plausible {
            private int $requestCount = 0;

            public function fetchData(WidgetDataInterface $data): array
            {
                $this->requestCount++;
                return ['total' => 100];
            }

            public function getRequestCount(): int
            {
                return $this->requestCount;
            }
        };
        $source->handle = 'deletedSiteSource';
        $widget = new Counter(['metric' => 'visitors', 'period' => Last7Days::class]);
        $widget->setSource($source);
        $widget->setView($view);

        expect(fn() => $widget->getWidgetData(null, true))->toThrow(Exception::class, 'Craft site is unavailable');
        expect($source->getRequestCount())->toBe(0);
    } finally {
        // Complete the request-level config write inside the transaction to release its mutex.
        $projectConfig->saveModifiedConfigData();
        $transaction->rollBack();
        $projectConfig->reset();
        Craft::$app->getInfo()->configVersion = $configVersion;
        Craft::$app->set('sites', $originalSites);
    }
});
