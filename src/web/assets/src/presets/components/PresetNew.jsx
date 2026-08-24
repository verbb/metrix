import { useState } from 'react';

import { Button, Dialog, Icon } from '@verbb/plugin-kit-react/components';

import { PresetSettings } from '@presets/components/PresetSettings';

import useAppStore from '@presets/hooks/useAppStore';

export function PresetNew({ onAdd }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const newWidget = useAppStore((state) => state.newWidget);

    const handleSave = (updatedWidget) => {
        onAdd(updatedWidget);
        setIsDialogOpen(false);
    };

    return (
        <>
            <Button
                type="button"
                variant="dashed"
                className="metrix-preset-new-widget py-2"
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
                    <PresetSettings
                        isNew
                        newWidget={newWidget}
                        onClose={() => setIsDialogOpen(false)}
                        onSave={handleSave}
                    />
                ) : null}
            </Dialog>
        </>
    );
}
