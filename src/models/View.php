<?php
namespace verbb\metrix\models;

use craft\base\Model;
use craft\helpers\Json;

use DateTime;

class View extends Model
{
    // Properties
    // =========================================================================

    public ?int $id = null;
    public ?string $name = null;
    public ?string $handle = null;
    public ?array $settings = null;
    public ?int $sortOrder = null;
    public ?DateTime $dateCreated = null;
    public ?DateTime $dateUpdated = null;
    public ?string $uid = null;


    // Public Methods
    // =========================================================================

    public function __construct($config = [])
    {
        if (isset($config['settings']) && is_string($config['settings'])) {
            $decoded = Json::decodeIfJson($config['settings']);
            $config['settings'] = is_array($decoded) ? $decoded : [];
        }

        parent::__construct($config);
    }

    public function getAnalyticsScope(): AnalyticsScope
    {
        return AnalyticsScope::fromConfig($this->settings['analyticsScope'] ?? null);
    }

    public function setAnalyticsScope(AnalyticsScope|array|null $scope): void
    {
        if ($this->settings === null) {
            $this->settings = [];
        }

        if ($scope === null) {
            unset($this->settings['analyticsScope']);

            return;
        }

        $model = $scope instanceof AnalyticsScope ? $scope : AnalyticsScope::fromConfig($scope);

        if ($model->mode === AnalyticsScope::MODE_NONE) {
            unset($this->settings['analyticsScope']);

            return;
        }

        $this->settings['analyticsScope'] = $model->toConfig();
    }
}
