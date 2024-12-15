import { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';

import { Dialog, DialogTrigger, DialogContent } from '@components/ui/Dialog';
import { Button } from '@components/ui/Button';
import { PresetSettings } from './PresetSettings';

import useAppStore from '@hooks/useAppStore';

export function PresetNew({ onAdd }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const newWidget = useAppStore((state) => { return state.newWidget; });

    const handleSave = (updatedWidget) => {
        onAdd(updatedWidget);

        setIsDialogOpen(false);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="dashed" type="button" className="mc-py-2">
                    <Plus strokeWidth="4" /> {Craft.t('metrix', 'New widget')}
                </Button>
            </DialogTrigger>

            <DialogContent>
                <PresetSettings
                    isNew={true}
                    newWidget={newWidget}
                    onClose={() => { return setIsDialogOpen(false); }}
                    onSave={handleSave}
                />
            </DialogContent>
        </Dialog>
    );
}
