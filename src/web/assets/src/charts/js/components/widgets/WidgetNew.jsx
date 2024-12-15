import { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';

import { Dialog, DialogTrigger, DialogContent } from '@components/ui/Dialog';
import { Button } from '@components/ui/Button';
import { WidgetSettings } from '@components/widgets/WidgetSettings';

import useAppStore from '@hooks/useAppStore';

export function WidgetNew() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const newWidget = useAppStore((state) => { return state.newWidget; });

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" type="button">
                    <Plus strokeWidth="4" /> {Craft.t('metrix', 'New widget')}
                </Button>
            </DialogTrigger>

            <DialogContent>
                <WidgetSettings
                    isNew={true}
                    newWidget={newWidget}
                    onClose={() => { return setIsDialogOpen(false); }}
                />
            </DialogContent>
        </Dialog>
    );
}
