import { ChevronDown } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@components/ui/DropdownMenu';

import { Button } from '@components/ui/Button';
import LoadingSpinner from '@components/LoadingSpinner';

import useAppStore from '@dashboard/hooks/useAppStore';

import NoWidgetsSvg from '@dashboard/components/NoWidgetsSvg';
import { WidgetNew } from '@dashboard/components/widgets/WidgetNew';

import { getErrorMessage } from '@utils';

export const DashboardEmptyState = ({
    type,
    onPresetSelect,
    loadingPresets,
    errorPresets,
}) => {
    const presets = useAppStore((state) => { return state.presets; });

    const renderContent = () => {
        if (type === 'noSources') {
            return (
                <>
                    <h2 className="mc-font-semibold mc-text-2xl mc-mb-4 mc-text-slate-600">
                        {Craft.t('metrix', 'No sources available')}
                    </h2>

                    <p className="mc-text-slate-500 mc-mb-6">

                        {Craft.t('metrix', 'Add a data source to start using widgets.')}
                    </p>
                </>
            );
        }

        if (type === 'noViewOptions') {
            return (
                <>
                    <h2 className="mc-font-semibold mc-text-2xl mc-mb-4 mc-text-slate-600">
                        {Craft.t('metrix', 'No views available')}
                    </h2>

                    <p className="mc-text-slate-500 mc-mb-6">
                        {Craft.t('metrix', 'Configure views to display your widgets.')}
                    </p>
                </>
            );
        }

        if (type === 'noWidgets') {
            const errorDetail = getErrorMessage(errorPresets?.error);

            return (
                <>
                    <h2 className="mc-font-semibold mc-text-2xl mc-mb-4 mc-text-slate-600">
                        {Craft.t('metrix', 'No widgets yet')}
                    </h2>

                    <p className="mc-text-slate-500 mc-mb-6">
                        {Craft.t('metrix', 'Start adding widgets to see your data at a glance.')}
                    </p>

                    <div className="mc-flex mc-gap-4">
                        <WidgetNew />

                        {presets.length > 0 && (
                            <>
                                {presets.length === 1 ? (
                                    <Button
                                        variant="primary"
                                        size="medium"
                                        type="button"
                                        title={Craft.t('metrix', 'Load preset widgets')}
                                        aria-label={Craft.t('metrix', 'Load preset widgets')}
                                        className="mc-gap-3"
                                        onClick={() => { return onPresetSelect(presets[0].value); }}
                                        disabled={loadingPresets}
                                    >
                                        {Craft.t('metrix', 'Load preset widgets')}

                                        {loadingPresets && (
                                            <LoadingSpinner size="tiny" className="mc-border-t-white mc-border-r-white" />
                                        )}
                                    </Button>
                                ) : (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            className="focus:mc-shadow-none"
                                            asChild
                                        >
                                            <Button
                                                variant="primary"
                                                size="medium"
                                                type="button"
                                                title={Craft.t('metrix', 'Load preset widgets')}
                                                aria-label={Craft.t('metrix', 'Load preset widgets')}
                                                className="mc-gap-3"
                                                disabled={loadingPresets}
                                            >
                                                {Craft.t('metrix', 'Load preset widgets')}

                                                {loadingPresets && (
                                                    <LoadingSpinner size="tiny" className="mc-border-t-white mc-border-r-white" />
                                                )}

                                                <ChevronDown />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            {presets.map((preset, index) => {
                                                return (
                                                    <DropdownMenuItem
                                                        key={preset.value}
                                                        onClick={() => { return onPresetSelect(preset.value); }}
                                                    >
                                                        {preset.label}
                                                    </DropdownMenuItem>
                                                );
                                            })}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </>
                        )}
                    </div>

                    {errorPresets && errorDetail && (
                        <div className="mc-mt-8 mc-text-red-500 mc-text-lg mc-text-center mc-w-full mc-leading-relaxed">
                            <strong className="mc-block">{errorDetail.heading}</strong>
                            <small className="mc-block mc-mb-2">{errorDetail.text}</small>

                            <small className="mc-block mc-font-mono mc-text-[10px]">
                                {errorDetail.trace.map((str) => {
                                    return <span key={str} className="mc-block">{str}</span>;
                                })}
                            </small>
                        </div>
                    )}
                </>
            );
        }
    };

    return (
        <div className="zilch mc-flex mc-relative mc-overflow-hidden mc-flex-col mc-items-center mc-justify-center mc-text-center mc-pt-[19rem]">
            <div className="mc-w-[512px] mc-h-[512px] mc-absolute mc-z-0 mc-top-0 -mc-mt-[5rem]">
                <NoWidgetsSvg />
            </div>

            <div className="mc-relative mc-z-0 mc-flex mc-flex-col mc-items-center mc-w-full">
                {renderContent()}
            </div>
        </div>
    );
};
