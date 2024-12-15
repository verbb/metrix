<?php
namespace verbb\metrix\services;

use verbb\metrix\events\ViewEvent;
use verbb\metrix\models\View;
use verbb\metrix\records\View as ViewRecord;

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

class Views extends Component
{
    // Constants
    // =========================================================================

    public const EVENT_BEFORE_SAVE_VIEW = 'beforeSaveView';
    public const EVENT_AFTER_SAVE_VIEW = 'afterSaveView';
    public const EVENT_BEFORE_DELETE_VIEW = 'beforeDeleteView';
    public const EVENT_AFTER_DELETE_VIEW = 'afterDeleteView';


    // Properties
    // =========================================================================

    private ?MemoizableArray $_views = null;


    // Public Methods
    // =========================================================================

    public function getAllViews(): array
    {
        return $this->_views()->all();
    }

    public function getAllViewableViews(): array
    {
        if (Craft::$app->getRequest()->getIsConsoleRequest()) {
            return $this->getAllViews();
        }

        $user = Craft::$app->getUser()->getIdentity();

        if (!$user) {
            return [];
        }

        return ArrayHelper::where($this->getAllViews(), function($view) use ($user) {
            return $user->can("metrix-dashboard:$view->uid");
        }, true, true, false);
    }

    public function getViewById(int $id): ?View
    {
        return $this->_views()->firstWhere('id', $id);
    }

    public function getViewByHandle(string $handle): ?View
    {
        return $this->_views()->firstWhere('handle', $handle, true);
    }

    public function saveView(View $view, bool $runValidation = true): bool
    {
        $isNewView = !$view->id;

        // Fire a 'beforeSaveView' event
        if ($this->hasEventHandlers(self::EVENT_BEFORE_SAVE_VIEW)) {
            $this->trigger(self::EVENT_BEFORE_SAVE_VIEW, new ViewEvent([
                'view' => $view,
                'isNew' => $isNewView,
            ]));
        }

        if ($runValidation && !$view->validate()) {
            Craft::info('View not saved due to validation error.', __METHOD__);
            return false;
        }

        $viewRecord = $this->_getViewRecordById($view->id);
        $viewRecord->name = $view->name;
        $viewRecord->handle = $view->handle;

        if ($isNewView) {
            $maxSortOrder = (new Query())
                ->from(['{{%metrix_views}}'])
                ->max('[[sortOrder]]');

            $viewRecord->sortOrder = $maxSortOrder ? $maxSortOrder + 1 : 1;
        }

        $viewRecord->save(false);

        if (!$view->id) {
            $view->id = $viewRecord->id;
        }

        // Fire an 'afterSaveView' event
        if ($this->hasEventHandlers(self::EVENT_AFTER_SAVE_VIEW)) {
            $this->trigger(self::EVENT_AFTER_SAVE_VIEW, new ViewEvent([
                'view' => $view,
                'isNew' => $isNewView,
            ]));
        }

        return true;
    }

    public function reorderViews(array $viewIds): bool
    {
        $transaction = Craft::$app->getDb()->beginTransaction();

        try {
            foreach ($viewIds as $viewOrder => $viewId) {
                $viewRecord = $this->_getViewRecordById($viewId);
                $viewRecord->sortOrder = $viewOrder + 1;
                $viewRecord->save();
            }

            $transaction->commit();
        } catch (Throwable $e) {
            $transaction->rollBack();

            throw $e;
        }

        return true;
    }

    public function deleteViewById(int $viewId): bool
    {
        $view = $this->getViewById($viewId);

        if (!$view) {
            return false;
        }

        return $this->deleteView($view);
    }

    public function deleteView(View $view): bool
    {
        // Fire a 'beforeDeleteView' event
        if ($this->hasEventHandlers(self::EVENT_BEFORE_DELETE_VIEW)) {
            $this->trigger(self::EVENT_BEFORE_DELETE_VIEW, new ViewEvent([
                'view' => $view,
            ]));
        }

        Db::delete('{{%metrix_views}}', ['id' => $view->id]);

        // Fire an 'afterDeleteView' event
        if ($this->hasEventHandlers(self::EVENT_AFTER_DELETE_VIEW)) {
            $this->trigger(self::EVENT_AFTER_DELETE_VIEW, new ViewEvent([
                'view' => $view,
            ]));
        }

        // Clear caches
        $this->_views = null;

        return true;
    }


    // Private Methods
    // =========================================================================

    private function _views(): MemoizableArray
    {
        if (!isset($this->_views)) {
            $views = [];

            foreach ($this->_createViewQuery()->all() as $result) {
                $views[] = new View($result);
            }

            $this->_views = new MemoizableArray($views);
        }

        return $this->_views;
    }

    private function _createViewQuery(): Query
    {
        return (new Query())
            ->select([
                'id',
                'name',
                'handle',
                'sortOrder',
                'dateCreated',
                'dateUpdated',
                'uid',
            ])
            ->from(['{{%metrix_views}}'])
            ->orderBy(['sortOrder' => SORT_ASC]);
    }

    private function _getViewRecordById(int $viewId = null): ?ViewRecord
    {
        if ($viewId !== null) {
            $viewRecord = ViewRecord::findOne(['id' => $viewId]);

            if (!$viewRecord) {
                throw new Exception(Craft::t('metrix', 'No view exists with the ID “{id}”.', ['id' => $viewId]));
            }
        } else {
            $viewRecord = new ViewRecord();
        }

        return $viewRecord;
    }

}
