import { lazy, Suspense, useState } from 'react';

import { Button } from '@verbb/plugin-kit-react/components/Button';
import { Dialog } from '@verbb/plugin-kit-react/components/Dialog';
import { Icon } from '@verbb/plugin-kit-react/components/Icon';

import useAppStore from '@dashboard/hooks/useAppStore';

const WidgetSettings = lazy(() => import('./WidgetSettings.jsx').then((module) => ({
    default: module.WidgetSettings,
})));

export function WidgetNewDialog({ open, onOpenChange }) {
    const newWidget = useAppStore((state) => state.newWidget);

    return (
        <Dialog
            className="metrix-widget-settings-dialog"
            open={open}
            label={Craft.t('metrix', 'Add New Widget')}
            onPkOpenChange={(event) => {
                onOpenChange(Boolean(event.detail?.open));
            }}
        >
            {open ? (
                <Suspense fallback={<div role="status">{Craft.t('metrix', 'Loading…')}</div>}>
                    <WidgetSettings
                        isNew
                        newWidget={newWidget}
                        onClose={() => onOpenChange(false)}
                    />
                </Suspense>
            ) : null}
        </Dialog>
    );
}

export function WidgetNew({ buttonSize }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const canManageViewLayouts = useAppStore((state) => state.canManageViewLayouts);

    if (!canManageViewLayouts) {
        return null;
    }

    return (
        <>
            <Button
                type="button"
                variant="default"
                size={buttonSize}
                onClick={() => setIsDialogOpen(true)}
            >
                <Icon slot="start" icon="plus" />
                {Craft.t('metrix', 'New widget')}
            </Button>

            <WidgetNewDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </>
    );
}
