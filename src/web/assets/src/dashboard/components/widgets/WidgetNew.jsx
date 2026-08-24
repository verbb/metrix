import { useState } from 'react';

import { Button, Dialog, Icon } from '@verbb/plugin-kit-react/components';

import { WidgetSettings } from '@dashboard/components/widgets/WidgetSettings';

import useAppStore from '@dashboard/hooks/useAppStore';

export function WidgetNew({ buttonSize }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const newWidget = useAppStore((state) => state.newWidget);

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

            <Dialog
                className="metrix-widget-settings-dialog"
                open={isDialogOpen}
                label={Craft.t('metrix', 'Add New Widget')}
                onPkOpenChange={(event) => {
                    setIsDialogOpen(Boolean(event.detail?.open));
                }}
            >
                {isDialogOpen ? (
                    <WidgetSettings
                        isNew
                        newWidget={newWidget}
                        onClose={() => setIsDialogOpen(false)}
                    />
                ) : null}
            </Dialog>
        </>
    );
}
