<?php
namespace verbb\metrix\services;

use verbb\metrix\base\PeriodInterface;
use verbb\metrix\periods as periodTypes;

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

class Periods extends Component
{
    // Constants
    // =========================================================================

    public const EVENT_REGISTER_PERIOD_TYPES = 'registerPeriodTypes';


    // Properties
    // =========================================================================

    private array $_periods = [];


    // Public Methods
    // =========================================================================

    public function getAllPeriodTypes(): array
    {
        if ($this->_periods) {
            return $this->_periods;
        }

        $periodTypes = [
            periodTypes\Today::class,
            periodTypes\Yesterday::class,

            periodTypes\Last7Days::class,
            periodTypes\WeekToDate::class,
            periodTypes\LastWeek::class,

            periodTypes\Last30Days::class,
            periodTypes\MonthToDate::class,
            periodTypes\LastMonth::class,

            periodTypes\Last12Months::class,
            periodTypes\YearToDate::class,
            periodTypes\LastYear::class,

            periodTypes\AllTime::class,
        ];

        $event = new RegisterComponentTypesEvent([
            'types' => $periodTypes,
        ]);

        $this->trigger(self::EVENT_REGISTER_PERIOD_TYPES, $event);

        foreach ($event->types as $class) {
            $this->_periods[$class] = $class;
        }

        return $this->_periods;
    }

    public function getGroupedPeriodTypes(): array
    {
        $periodTypes = $this->getAllPeriodTypes();

        $groupedPeriods[] = array_filter([
            ArrayHelper::remove($periodTypes, periodTypes\Today::class),
            ArrayHelper::remove($periodTypes, periodTypes\Yesterday::class),
        ]);

        $groupedPeriods[] = array_filter([
            ArrayHelper::remove($periodTypes, periodTypes\Last7Days::class),
            ArrayHelper::remove($periodTypes, periodTypes\WeekToDate::class),
            ArrayHelper::remove($periodTypes, periodTypes\LastWeek::class),
        ]);

        $groupedPeriods[] = array_filter([
            ArrayHelper::remove($periodTypes, periodTypes\Last30Days::class),
            ArrayHelper::remove($periodTypes, periodTypes\MonthToDate::class),
            ArrayHelper::remove($periodTypes, periodTypes\LastMonth::class),
        ]);

        $groupedPeriods[] = array_filter([
            ArrayHelper::remove($periodTypes, periodTypes\Last12Months::class),
            ArrayHelper::remove($periodTypes, periodTypes\YearToDate::class),
            ArrayHelper::remove($periodTypes, periodTypes\LastYear::class),
        ]);

        $groupedPeriods[] = array_filter([
            ArrayHelper::remove($periodTypes, periodTypes\AllTime::class),
        ]);

        return $groupedPeriods;
    }

}
