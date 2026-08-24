import {
    Button,
    DropdownItem,
    DropdownMenu,
    Icon,
} from '@verbb/plugin-kit-react/components';

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
    const presets = useAppStore((state) => state.presets);

    const renderContent = () => {
        if (type === 'noSources') {
            return (
                <div className="text-center">
                    <h2 className="font-semibold text-2xl mb-4 text-gray-600">
                        {Craft.t('metrix', 'No sources available')}
                    </h2>

                    <p className="text-gray-500 mb-6">
                        {Craft.t('metrix', 'Add a data source to start using widgets.')}
                    </p>
                </div>
            );
        }

        if (type === 'noViewOptions') {
            return (
                <div className="text-center">
                    <h2 className="font-semibold text-2xl mb-4 text-gray-600">
                        {Craft.t('metrix', 'No views available')}
                    </h2>

                    <p className="text-gray-500 mb-6">
                        {Craft.t('metrix', 'Configure views to display your widgets.')}
                    </p>
                </div>
            );
        }

        if (type === 'noWidgets') {
            const errorDetail = errorPresets?.error ? getErrorMessage(errorPresets.error) : null;

            return (
                <>
                    <div className="text-center">
                        <h2 className="font-semibold text-2xl mb-4 text-gray-600">
                            {Craft.t('metrix', 'No widgets yet')}
                        </h2>

                        <p className="text-gray-500 mb-6">
                            {Craft.t('metrix', 'Start adding widgets to see your data at a glance.')}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <WidgetNew buttonSize="lg" />

                        {presets.length > 0 && (
                            <>
                                {presets.length === 1 ? (
                                    <Button
                                        type="button"
                                        variant="primary"
                                        size="lg"
                                        title={Craft.t('metrix', 'Load preset widgets')}
                                        aria-label={Craft.t('metrix', 'Load preset widgets')}
                                        loading={loadingPresets}
                                        disabled={loadingPresets}
                                        onClick={() => onPresetSelect(presets[0].value)}
                                    >
                                        {Craft.t('metrix', 'Load preset widgets')}
                                    </Button>
                                ) : (
                                    <DropdownMenu placement="bottom-end">
                                        <Button
                                            slot="trigger"
                                            type="button"
                                            variant="primary"
                                            size="lg"
                                            title={Craft.t('metrix', 'Load preset widgets')}
                                            aria-label={Craft.t('metrix', 'Load preset widgets')}
                                            loading={loadingPresets}
                                            disabled={loadingPresets}
                                        >
                                            {Craft.t('metrix', 'Load preset widgets')}
                                            <Icon slot="end" icon="chevron-down" className="size-3" />
                                        </Button>

                                        {presets.map((preset) => (
                                            <DropdownItem
                                                key={preset.value}
                                                value={preset.value}
                                                onPkSelect={() => onPresetSelect(preset.value)}
                                            >
                                                {preset.label}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                )}
                            </>
                        )}
                    </div>

                    {errorPresets && errorDetail && (
                        <div className="mt-8 text-error text-lg text-center w-full leading-relaxed">
                            <strong className="block">{errorDetail.heading}</strong>
                            <small className="block mb-2">{errorDetail.text}</small>

                            <small className="block font-mono text-[10px]">
                                {errorDetail.traceAsArray.map((str) => (
                                    <span key={str} className="block">{str}</span>
                                ))}
                            </small>
                        </div>
                    )}
                </>
            );
        }
    };

    return (
        <div className="zilch flex relative overflow-hidden flex-col items-center justify-center pt-[19rem]">
            <div className="w-[512px] h-[512px] absolute z-0 top-0 -mt-[5rem]">
                <NoWidgetsSvg />
            </div>

            <div className="relative z-0 flex flex-col items-center w-full">
                {renderContent()}
            </div>
        </div>
    );
};
