import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@components/ui/Select';

import { WidgetNew } from '@dashboard/components/widgets/WidgetNew';
import { WidgetLayoutSettings } from '@dashboard/components/widgets/WidgetLayoutSettings';

import { cn } from '@utils';

export const DashboardHeader = ({
    viewOptions,
    currentView,
    onChangeView,
    showHeader,
    showHeaderActions,
}) => {
    return showHeader && (
        <header className="mc-flex mc-items-center mc-justify-between mc-mb-4">
            <div className="mc-flex mc-items-center mc-justify-between mc-gap-4">
                <h1 className="mc-font-bold mc-text-lg" title={Craft.t('metrix', 'Dashboard')}>
                    {Craft.t('metrix', 'Dashboard')}
                </h1>

                {viewOptions.length > 1 && (
                    <Select value={currentView} onValueChange={onChangeView}>
                        <SelectTrigger
                            className={cn(
                                'mc-px-3 mc-py-2 mc-gap-1 mc-text-sm',
                                'mc-bg-[#c4d0e1] hover:mc-bg-[#bccadc]',
                                'hover:mc-shadow-none focus:mc-shadow-none',
                            )}
                        >
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent
                            className={cn(
                                'mc-border mc-bg-white',
                            )}
                        >
                            {viewOptions.map((view) => {
                                return (
                                    <SelectItem
                                        className="focus:mc-bg-slate-100"
                                        key={view.value}
                                        value={view.value}
                                    >
                                        {view.label}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                )}
            </div>

            {showHeaderActions && (
                <div className="mc-flex mc-gap-2">
                    <WidgetNew />
                    <WidgetLayoutSettings />
                </div>
            )}
        </header>
    );
};
