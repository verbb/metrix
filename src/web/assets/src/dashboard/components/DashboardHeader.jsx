import { SelectInput } from '@verbb/plugin-kit-react/components';

import { GroupedPeriodSelect } from '@components/GroupedPeriodSelect';
import { WidgetNew } from '@dashboard/components/widgets/WidgetNew';
import { WidgetLayoutSettings } from '@dashboard/components/widgets/WidgetLayoutSettings';
import { normalizePeriodOptionGroups } from '@utils/periodOptions';

export const DashboardHeader = ({
    viewOptions,
    currentView,
    onChangeView,
    periodOptions,
    globalPeriod,
    onGlobalPeriodChange,
    showHeader,
    showHeaderActions,
    showGlobalPeriod,
}) => {
    const periodGroups = normalizePeriodOptionGroups(periodOptions);

    return showHeader && (
        <header className="flex items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-4 min-w-0">
                <h1 className="font-bold text-lg shrink-0" title={Craft.t('metrix', 'Dashboard')}>
                    {Craft.t('metrix', 'Dashboard')}
                </h1>

                {viewOptions.length > 1 && (
                    <SelectInput
                        className="shrink-0"
                        options={viewOptions}
                        value={currentView}
                        onChange={onChangeView}
                    />
                )}

                {showGlobalPeriod && periodGroups.length > 0 && (
                    <GroupedPeriodSelect
                        className="shrink-0"
                        periodOptions={periodOptions}
                        value={globalPeriod}
                        placeholder={Craft.t('metrix', 'Date range')}
                        clearable
                        onChange={onGlobalPeriodChange}
                    />
                )}
            </div>

            {showHeaderActions && (
                <div className="flex gap-2 shrink-0">
                    <WidgetNew />
                    <WidgetLayoutSettings />
                </div>
            )}
        </header>
    );
};
