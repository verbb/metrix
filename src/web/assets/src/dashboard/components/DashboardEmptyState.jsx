import {
    Button,
    DropdownItem,
    DropdownMenu,
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

    const sourcesUrl = typeof Craft.getCpUrl === 'function'
        ? Craft.getCpUrl('metrix/sources')
        : Craft.getUrl('metrix/sources');
    const settingsUrl = typeof Craft.getCpUrl === 'function'
        ? Craft.getCpUrl('metrix/settings')
        : Craft.getUrl('metrix/settings');

    const renderContent = () => {
        if (type === 'noSources') {
            return (
                <div className="text-center max-w-xl">
                    <h2 className="font-semibold text-2xl mb-4 text-gray-600">
                        {Craft.t('metrix', 'No sources available')}
                    </h2>

                    <p className="text-gray-500 mb-6">
                        {Craft.t('metrix', 'Add a data source to start using widgets.')}
                    </p>

                    <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        onClick={() => { window.location.href = sourcesUrl; }}
                    >
                        {Craft.t('metrix', 'Add a source')}
                    </Button>
                </div>
            );
        }

        if (type === 'noViewOptions') {
            return (
                <div className="text-center max-w-xl">
                    <h2 className="font-semibold text-2xl mb-4 text-gray-600">
                        {Craft.t('metrix', 'No views available')}
                    </h2>

                    <p className="text-gray-500 mb-6">
                        {Craft.t('metrix', 'Configure views to display your widgets.')}
                    </p>

                    <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        onClick={() => { window.location.href = settingsUrl; }}
                    >
                        {Craft.t('metrix', 'Configure views')}
                    </Button>
                </div>
            );
        }

        if (type === 'noWidgets') {
            const errorDetail = errorPresets?.error ? getErrorMessage(errorPresets.error) : null;

            return (
                <>
                    <div className="text-center max-w-xl">
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
                            <DropdownMenu placement="bottom-end">
                                <Button
                                    slot="trigger"
                                    type="button"
                                    variant="primary"
                                    size="lg"
                                    withCaret
                                    loading={loadingPresets}
                                    disabled={loadingPresets}
                                    title={Craft.t('metrix', 'Load preset widgets')}
                                    aria-label={Craft.t('metrix', 'Load preset widgets')}
                                >
                                    {Craft.t('metrix', 'Load preset widgets')}
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
                    </div>

                    {errorPresets && errorDetail && (
                        <div className="mt-8 text-error text-sm text-center w-full max-w-lg leading-relaxed">
                            <strong className="block mb-1">
                                {errorDetail.heading || Craft.t('metrix', 'Unable to load preset.')}
                            </strong>
                            {errorDetail.text ? (
                                <span className="block text-gray-600">{errorDetail.text}</span>
                            ) : null}
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

            <div className="relative z-0 flex flex-col items-center w-full px-4">
                {renderContent()}
            </div>
        </div>
    );
};
