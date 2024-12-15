<?php
namespace verbb\metrix\services;

use verbb\metrix\Metrix;
use verbb\metrix\base\WidgetInterface;
use verbb\metrix\events\WidgetEvent;
use verbb\metrix\records\Widget as WidgetRecord;
use verbb\metrix\widgets as widgetTypes;

use Craft;
use craft\base\MemoizableArray;
use craft\db\Query;
use craft\errors\MissingComponentException;
use craft\events\RegisterComponentTypesEvent;
use craft\helpers\ArrayHelper;
use craft\helpers\Component as ComponentHelper;
use craft\helpers\Db;
use craft\helpers\Json;

use yii\base\Component;
use yii\base\InvalidConfigException;

use Exception;
use Throwable;

class Widgets extends Component
{
    // Constants
    // =========================================================================

    public const EVENT_REGISTER_WIDGET_TYPES = 'registerWidgetTypes';
    public const EVENT_BEFORE_SAVE_WIDGET = 'beforeSaveWidget';
    public const EVENT_AFTER_SAVE_WIDGET = 'afterSaveWidget';
    public const EVENT_BEFORE_DELETE_WIDGET = 'beforeDeleteWidget';
    public const EVENT_AFTER_DELETE_WIDGET = 'afterDeleteWidget';


    // Properties
    // =========================================================================

    private ?MemoizableArray $_widgets = null;


    // Public Methods
    // =========================================================================

    public function getAllWidgetTypes(): array
    {
        $widgetTypes = [
            widgetTypes\Bar::class,
            widgetTypes\Counter::class,
            widgetTypes\Line::class,
            widgetTypes\Pie::class,
            widgetTypes\Table::class,
        ];

        $event = new RegisterComponentTypesEvent([
            'types' => $widgetTypes,
        ]);

        $this->trigger(self::EVENT_REGISTER_WIDGET_TYPES, $event);

        return $event->types;
    }

    public function createWidget(mixed $config): WidgetInterface
    {
        try {
            return ComponentHelper::createComponent($config, WidgetInterface::class);
        } catch (MissingComponentException|InvalidConfigException $e) {
            $config['errorMessage'] = $e->getMessage();
            $config['expectedType'] = $config['type'];
            unset($config['type']);
            return new widgetTypes\MissingWidget($config);
        }
    }

    public function getAllWidgets(): array
    {
        return $this->_widgets()->all();
    }

    public function getAllEnabledWidgets(): array
    {
        $widgets = [];

        $enabledTypes = Metrix::$plugin->getSettings()->getEnabledWidgetTypes();

        foreach ($this->_widgets()->all() as $widget) {
            if (in_array($widget::class, $enabledTypes)) {
                $widgets[] = $widget;
            }
        }

        return $widgets;
    }

    public function getWidgetById(int $id): ?WidgetInterface
    {
        return $this->_widgets()->firstWhere('id', $id);
    }

    public function getWidgetsForView(?string $viewHandle): array
    {
        $widgets = [];

        foreach ($this->getAllEnabledWidgets() as $widget) {
            if ($widget->getView()?->handle === $viewHandle) {
                $widgets[] = $widget->getFrontEndData();
            }
        }

        return $widgets;
    }

    public function saveWidget(WidgetInterface $widget, bool $runValidation = true): bool
    {
        $isNewWidget = !$widget->id;

        // Fire a 'beforeSaveWidget' event
        if ($this->hasEventHandlers(self::EVENT_BEFORE_SAVE_WIDGET)) {
            $this->trigger(self::EVENT_BEFORE_SAVE_WIDGET, new WidgetEvent([
                'widget' => $widget,
                'isNew' => $isNewWidget,
            ]));
        }

        if ($runValidation && !$widget->validate()) {
            Craft::info('Widget not saved due to validation error.', __METHOD__);
            return false;
        }

        $widgetRecord = $this->_getWidgetRecordById($widget->id);
        $widgetRecord->sourceId = $widget->sourceId;
        $widgetRecord->viewId = $widget->viewId;
        $widgetRecord->type = get_class($widget);
        $widgetRecord->settings = $widget->settings;

        if ($isNewWidget) {
            $maxSortOrder = (new Query())
                ->from(['{{%metrix_widgets}}'])
                ->max('[[sortOrder]]');

            $widgetRecord->sortOrder = $maxSortOrder ? $maxSortOrder + 1 : 1;
        }

        $widgetRecord->save(false);

        if (!$widget->id) {
            $widget->id = $widgetRecord->id;
        }

        // Fire an 'afterSaveWidget' event
        if ($this->hasEventHandlers(self::EVENT_AFTER_SAVE_WIDGET)) {
            $this->trigger(self::EVENT_AFTER_SAVE_WIDGET, new WidgetEvent([
                'widget' => $widget,
                'isNew' => $isNewWidget,
            ]));
        }

        return true;
    }

    public function reorderWidgets(array $widgetIds): bool
    {
        $transaction = Craft::$app->getDb()->beginTransaction();

        try {
            foreach ($widgetIds as $widgetOrder => $widgetId) {
                $widgetRecord = $this->_getWidgetRecordById($widgetId);
                $widgetRecord->sortOrder = $widgetOrder + 1;
                $widgetRecord->save();
            }

            $transaction->commit();
        } catch (Throwable $e) {
            $transaction->rollBack();

            throw $e;
        }

        return true;
    }

    public function deleteWidgetById(int $widgetId): bool
    {
        $widget = $this->getWidgetById($widgetId);

        if (!$widget) {
            return false;
        }

        return $this->deleteWidget($widget);
    }

    public function deleteWidget(WidgetInterface $widget): bool
    {
        // Fire a 'beforeDeleteWidget' event
        if ($this->hasEventHandlers(self::EVENT_BEFORE_DELETE_WIDGET)) {
            $this->trigger(self::EVENT_BEFORE_DELETE_WIDGET, new WidgetEvent([
                'widget' => $widget,
            ]));
        }

        Db::delete('{{%metrix_widgets}}', ['id' => $widget->id]);

        // Fire an 'afterDeleteWidget' event
        if ($this->hasEventHandlers(self::EVENT_AFTER_DELETE_WIDGET)) {
            $this->trigger(self::EVENT_AFTER_DELETE_WIDGET, new WidgetEvent([
                'widget' => $widget,
            ]));
        }

        // Clear caches
        $this->_widgets = null;

        return true;
    }


    // Private Methods
    // =========================================================================

    private function _widgets(): MemoizableArray
    {
        if (!isset($this->_widgets)) {
            $widgets = [];

            foreach ($this->_createWidgetQuery()->all() as $result) {
                $widgets[] = $this->createWidget($result);
            }

            $this->_widgets = new MemoizableArray($widgets);
        }

        return $this->_widgets;
    }

    private function _createWidgetQuery(): Query
    {
        return (new Query())
            ->select([
                'id',
                'sourceId',
                'viewId',
                'type',
                'settings',
                'sortOrder',
                'dateCreated',
                'dateUpdated',
                'uid',
            ])
            ->from(['{{%metrix_widgets}}'])
            ->orderBy(['sortOrder' => SORT_ASC]);
    }

    private function _getWidgetRecordById(int $widgetId = null): ?WidgetRecord
    {
        if ($widgetId !== null) {
            $widgetRecord = WidgetRecord::findOne(['id' => $widgetId]);

            if (!$widgetRecord) {
                throw new Exception(Craft::t('metrix', 'No widget exists with the ID “{id}”.', ['id' => $widgetId]));
            }
        } else {
            $widgetRecord = new WidgetRecord();
        }

        return $widgetRecord;
    }

}
