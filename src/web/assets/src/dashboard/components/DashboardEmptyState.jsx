import { Button } from '@verbb/plugin-kit-react/components/Button';
import { StatePanel } from '@verbb/plugin-kit-react/components/StatePanel';

import { AddWidgetsMenu } from '@dashboard/components/AddWidgetsMenu';
import useAppStore from '@dashboard/hooks/useAppStore';

import { getErrorMessage } from '@utils';

const cpUrl = (path) => {
    return typeof Craft.getCpUrl === 'function' ? Craft.getCpUrl(path) : Craft.getUrl(path);
};

export const PresetError = ({ errorPresets }) => {
    const errorDetail = errorPresets?.error ? getErrorMessage(errorPresets.error) : null;

    if (!errorDetail) {
        return null;
    }

    return (
        <div className="mt-6 text-error text-sm text-center w-full max-w-lg mx-auto leading-relaxed" role="alert">
            <strong className="block mb-1">
                {errorDetail.heading || Craft.t('metrix', 'Unable to load preset.')}
            </strong>

            {errorDetail.text ? (
                <span className="block text-gray-600">{errorDetail.text}</span>
            ) : null}
        </div>
    );
};

// Region empty states for a dashboard that has finished setup but can't show widgets right now.
export const DashboardEmptyState = ({
    type,
    onPresetSelect,
    onNewWidget,
    loadingPresets,
    errorPresets,
}) => {
    const canManageViewLayouts = useAppStore((state) => state.canManageViewLayouts);
    const canManageSources = useAppStore((state) => state.canManageSources);

    if (type === 'noSources') {
        return (
            <StatePanel heading={Craft.t('metrix', 'No sources available')}>
                {Craft.t('metrix', 'Add and connect a source to see its data here.')}

                {canManageSources ? (
                    <Button slot="actions" variant="primary" href={cpUrl('metrix/sources')}>
                        {Craft.t('metrix', 'Go to sources')}
                    </Button>
                ) : null}
            </StatePanel>
        );
    }

    if (type === 'noViewOptions') {
        return (
            <StatePanel heading={Craft.t('metrix', 'No views available')}>
                {canManageViewLayouts
                    ? Craft.t('metrix', 'Configure views to display your widgets.')
                    : Craft.t('metrix', 'No dashboard views are available to you.')}

                {canManageViewLayouts ? (
                    <Button slot="actions" variant="primary" href={cpUrl('metrix/views')}>
                        {Craft.t('metrix', 'Configure views')}
                    </Button>
                ) : null}
            </StatePanel>
        );
    }

    return (
        <>
            <StatePanel heading={Craft.t('metrix', 'No widgets yet')}>
                {canManageViewLayouts
                    ? Craft.t('metrix', 'Start adding widgets to see your data at a glance.')
                    : Craft.t('metrix', 'No widgets have been added to this view.')}

                {canManageViewLayouts ? (
                    <AddWidgetsMenu
                        slot="actions"
                        variant="primary"
                        loading={loadingPresets}
                        onPresetSelect={onPresetSelect}
                        onNewWidget={onNewWidget}
                    />
                ) : null}
            </StatePanel>

            <PresetError errorPresets={errorPresets} />
        </>
    );
};
