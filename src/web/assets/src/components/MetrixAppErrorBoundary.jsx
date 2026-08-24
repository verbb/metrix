import { AppErrorBoundary } from '@verbb/plugin-kit-react/utils';

const SURFACE_COPY = {
    dashboard: {
        consoleLabel: 'Metrix dashboard crashed:',
        titleKey: 'Something went wrong',
        messageKey: 'The dashboard failed to load. Please refresh the page or try again.',
    },
    presets: {
        consoleLabel: 'Metrix presets crashed:',
        titleKey: 'Something went wrong',
        messageKey: 'The presets editor failed to load. Please refresh the page or try again.',
    },
};

/** Formie/Navigation-style crash UI for Metrix CP React surfaces. */
export function MetrixAppErrorBoundary({ surface, children }) {
    const copy = SURFACE_COPY[surface];

    if (!copy) {
        throw new Error(`MetrixAppErrorBoundary: unknown surface "${surface}"`);
    }

    return (
        <AppErrorBoundary
            consoleLabel={copy.consoleLabel}
            title={Craft.t('metrix', copy.titleKey)}
            message={Craft.t('metrix', copy.messageKey)}
            detailsLabel={Craft.t('metrix', 'Show error details')}
            reloadLabel={Craft.t('metrix', 'Reload')}
            containerClassName="flex w-full min-h-[50vh] items-center justify-center py-12"
            contentClassName="flex flex-col items-center justify-center text-center"
        >
            {children}
        </AppErrorBoundary>
    );
}
