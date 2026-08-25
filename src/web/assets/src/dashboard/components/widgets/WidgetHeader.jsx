import { useState } from 'react';

import {
    Button,
    Dialog,
    DropdownItem,
    DropdownMenu,
    DropdownSeparator,
    Icon,
} from '@verbb/plugin-kit-react/components';

import { WidgetSettings } from '@dashboard/components/widgets/WidgetSettings';
import { WidthPicker } from '@components/WidthPicker';

import useWidgetStore from '@dashboard/hooks/useWidgetStore';

export function WidgetHeader({ widget }) {
    const duplicateWidget = useWidgetStore((state) => state.duplicateWidget);
    const updateWidget = useWidgetStore((state) => state.updateWidget);
    const removeWidget = useWidgetStore((state) => state.removeWidget);
    const refreshWidgetData = useWidgetStore((state) => state.refreshWidgetData);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const handleWidthChange = (newWidth) => {
        updateWidget(widget, { width: newWidth }, false);
        setIsMenuOpen(false);
    };

    const handleRefresh = async() => {
        setRefreshing(true);

        try {
            await refreshWidgetData(widget.__id);
        } finally {
            setRefreshing(false);
            setIsMenuOpen(false);
        }
    };

    const handleDuplicate = () => {
        duplicateWidget(widget);
    };

    const handleRemove = () => {
        const confirmation = window.confirm(
            Craft.t('metrix', 'Are you sure you want to delete this widget? This action cannot be undone.'),
        );

        if (confirmation) {
            removeWidget(widget);
        }
    };

    return (
        <div className="flex flex-row items-center relative z-[10] gap-2">
            <div className="font-bold text-gray-600 truncate min-w-0 flex-1">
                {widget.data.dimensionLabel && `${widget.data.dimensionLabel} - `}
                {widget.data.metricLabel}
            </div>

            <div className="flex flex-row items-center flex-shrink-0 gap-1 metrix-widget-header-controls">
                <DropdownMenu
                    className="metrix-widget-header-menu"
                    open={isMenuOpen}
                    placement="bottom-end"
                    onPkOpenChange={(event) => {
                        setIsMenuOpen(Boolean(event.detail?.open ?? event.target?.open));
                    }}
                >
                    <Button
                        slot="trigger"
                        type="button"
                        variant="default"
                        size="xs"
                        className="metrix-widget-menu-trigger"
                        aria-label={Craft.t('metrix', 'Widget actions')}
                    >
                        <Icon icon="ellipsis-vertical" />
                    </Button>

                    <DropdownItem
                        value="settings"
                        onPkSelect={() => {
                            setTimeout(() => {
                                setIsDialogOpen(true);
                            }, 100);
                        }}
                    >
                        {Craft.t('metrix', 'Settings')}
                    </DropdownItem>

                    <DropdownItem
                        value="refresh"
                        disabled={refreshing || widget.loading}
                        onPkSelect={handleRefresh}
                    >
                        {refreshing
                            ? Craft.t('metrix', 'Refreshing…')
                            : Craft.t('metrix', 'Refresh')}
                    </DropdownItem>

                    <DropdownItem value="duplicate" onPkSelect={handleDuplicate}>
                        {Craft.t('metrix', 'Duplicate')}
                    </DropdownItem>

                    {/* Non-selectable row — only the width-picker columns are actionable (legacy Radix preventDefault item). */}
                    <div className="metrix-widget-menu-width-row">
                        <span className="metrix-widget-menu-width-row__label">
                            {Craft.t('metrix', 'Column Size')}
                        </span>
                        <WidthPicker
                            value={widget.data.width}
                            onChange={handleWidthChange}
                        />
                    </div>

                    <DropdownSeparator />

                    <DropdownItem
                        value="delete"
                        destructive
                        onPkSelect={handleRemove}
                    >
                        {Craft.t('metrix', 'Delete')}
                    </DropdownItem>
                </DropdownMenu>

                <Dialog
                    className="metrix-widget-settings-dialog"
                    open={isDialogOpen}
                    label={Craft.t('metrix', 'Widget Settings')}
                    onPkOpenChange={(event) => {
                        setIsDialogOpen(Boolean(event.detail?.open));
                    }}
                >
                    {isDialogOpen ? (
                        <WidgetSettings
                            widget={widget}
                            onClose={() => setIsDialogOpen(false)}
                        />
                    ) : null}
                </Dialog>
            </div>
        </div>
    );
}
