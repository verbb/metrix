import {
    Button,
    SelectInput,
} from '@verbb/plugin-kit-react/components';

import { WidgetNew } from '@dashboard/components/widgets/WidgetNew';
import { WidgetLayoutSettings } from '@dashboard/components/widgets/WidgetLayoutSettings';

export const DashboardHeader = ({
    viewOptions,
    currentView,
    onChangeView,
    showHeader,
    showHeaderActions,
}) => {
    return showHeader && (
        <header className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-between gap-4">
                <h1 className="font-bold text-lg" title={Craft.t('metrix', 'Dashboard')}>
                    {Craft.t('metrix', 'Dashboard')}
                </h1>

                {viewOptions.length > 1 && (
                    <SelectInput
                        options={viewOptions}
                        value={currentView}
                        onChange={onChangeView}
                    />
                )}
            </div>

            {showHeaderActions && (
                <div className="flex gap-2">
                    <WidgetNew />
                    <WidgetLayoutSettings />
                </div>
            )}
        </header>
    );
};
