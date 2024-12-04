import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Dialog } from '@components/ui/Dialog';
import { Button } from '@components/ui/Button';
import { WidgetSettings } from '@components/widget/WidgetSettings';

export function WidgetNew() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const newWidget = {
        id: null,
        source: 'Google Analytics',
        type: 'verbb\\metrix\\widgets\\Line',
        period: '',
        metric: '',
        dimension: '',
        width: 2,
    };

    return (
        <>
            <Button
                variant="secondary"
                type="button"
                onClick={() => { return setIsDialogOpen(true); }}
            >
                <Plus strokeWidth="4" /> New widget
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                {isDialogOpen && (
                    <WidgetSettings
                        isNew={true}
                        newWidget={newWidget}
                        onClose={() => { return setIsDialogOpen(false); }}
                    />
                )}
            </Dialog>
        </>
    );
}
