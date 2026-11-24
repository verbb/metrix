import { Button } from '@verbb/plugin-kit-react/components/Button';
import { SetupChecklist, SetupStep } from '@verbb/plugin-kit-react/components/SetupChecklist';

import { AddWidgetsMenu } from '@dashboard/components/AddWidgetsMenu';
import useAppStore from '@dashboard/hooks/useAppStore';

const cpUrl = (path) => {
    return typeof Craft.getCpUrl === 'function' ? Craft.getCpUrl(path) : Craft.getUrl(path);
};

// The dashboard's first-run checklist. Each step's state comes from `DashboardSetup::getSteps()`, and the
// checklist leaves once the first widget is added.
export const DashboardSetup = ({
    setup,
    loadingPresets,
    onPresetSelect,
    onNewWidget,
}) => {
    const sources = useAppStore((state) => state.sources);
    const viewOptions = useAppStore((state) => state.viewOptions);
    const canManageViewLayouts = useAppStore((state) => state.canManageViewLayouts);

    const { source, connect, widgets } = setup;

    // Widgets need a configured source and a view to go in, so the last step only offers its button once
    // both exist.
    const canAddWidgets = canManageViewLayouts && sources.length > 0 && viewOptions.length > 0;
    const needsViews = canManageViewLayouts && viewOptions.length === 0;

    const lacksPermission = (!source.done && !setup.canManageSources)
        || (!connect.done && !setup.canConnectSources)
        || !canManageViewLayouts;

    const connectDescription = connect.sourceName
        ? Craft.t('metrix', 'Connect “{name}” so Metrix can read its data.', { name: connect.sourceName })
        : Craft.t('metrix', 'Sign in to the service or check its API credentials so Metrix can read its data.');

    return (
        <SetupChecklist
            heading={Craft.t('metrix', 'Build Your Analytics Dashboard')}
            countLabel={Craft.t('metrix', '{done} of {total} done')}
            doneLabel={Craft.t('metrix', '(done)')}
        >
            <span slot="intro">
                {Craft.t('metrix', 'Your widgets will show here. Each step ticks itself off when Metrix sees it done.')}
                {lacksPermission ? ` ${Craft.t('metrix', 'Someone who can manage Metrix sources and dashboard layouts can finish these steps.')}` : null}
            </span>

            <SetupStep heading={Craft.t('metrix', 'Add a source')} done={source.done}>
                {Craft.t('metrix', 'Choose the analytics service Metrix reads from, such as Google Analytics, Plausible or Fathom.')}

                {source.url ? (
                    <Button slot="action" href={source.url}>
                        {Craft.t('metrix', 'New source')}
                    </Button>
                ) : null}
            </SetupStep>

            <SetupStep heading={Craft.t('metrix', 'Connect your source')} done={connect.done}>
                {connect.done
                    ? Craft.t('metrix', 'Metrix can read data from your source.')
                    : connectDescription}

                {connect.url ? (
                    <Button slot="action" href={connect.url}>
                        {Craft.t('metrix', 'Connect source')}
                    </Button>
                ) : null}
            </SetupStep>

            <SetupStep heading={Craft.t('metrix', 'Add widgets or load a preset')} done={widgets.done}>
                {Craft.t('metrix', 'Start from a preset dashboard or add widgets one at a time.')}

                {canAddWidgets ? (
                    <AddWidgetsMenu
                        slot="action"
                        loading={loadingPresets}
                        onPresetSelect={onPresetSelect}
                        onNewWidget={onNewWidget}
                    />
                ) : null}

                {needsViews ? (
                    <Button slot="action" href={cpUrl('metrix/views')}>
                        {Craft.t('metrix', 'Configure views')}
                    </Button>
                ) : null}
            </SetupStep>
        </SetupChecklist>
    );
};
