import { useState } from 'react';
import { Cog8ToothIcon, EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { X } from 'lucide-react';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectSeparator,
} from '@components/ui/Select';

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from '@components/ui/Dialog';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@components/ui/DropdownMenu';

import { Button } from '@components/ui/Button';
import { WidgetSettings } from '@components/widgets/WidgetSettings';
import { WidthPicker } from '@components/WidthPicker';

import useWidgetStore from '@hooks/useWidgetStore';
import useAppStore from '@hooks/useAppStore';

import { cn, api } from '@utils';
import { preloadWidget } from '@utils/widgets';

export function WidgetHeader({ widget }) {
    const addWidget = useWidgetStore((state) => { return state.addWidget; });
    const duplicateWidget = useWidgetStore((state) => { return state.duplicateWidget; });
    const updateWidget = useWidgetStore((state) => { return state.updateWidget; });
    const removeWidget = useWidgetStore((state) => { return state.removeWidget; });
    const periodOptions = useAppStore((state) => { return state.periodOptions; });

    const [isOpen, setIsOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleWidthChange = (widget, newWidth) => {
        updateWidget(widget, { width: newWidth }, false);

        setIsOpen(false);
    };

    const handlePeriodChange = (widget, newPeriod) => {
        updateWidget(widget, { period: newPeriod });
    };

    const handleDuplicate = (widget) => {
        duplicateWidget(widget);
    };

    const handleRemove = (widget) => {
        const confirmation = window.confirm(
            Craft.t('metrix', 'Are you sure you want to delete this widget? This action cannot be undone.'),
        );

        if (confirmation) {
            removeWidget(widget);
        }
    };

    return (
        <div className="mc-flex mc-flex-row mc-items-center mc-relative mc-z-[10]">
            <div className="mc-font-bold mc-text-slate-600 mc-truncate mc-mr-4">
                {widget.data.dimensionLabel && `${widget.data.dimensionLabel} - `}
                {widget.data.metricLabel}
            </div>

            <div className="mc-flex mc-flex-row mc-items-center mc-flex-shrink-0 mc-gap-1 mc-ml-auto">
                <Select
                    value={widget.data.period}
                    onValueChange={(newPeriod) => {
                        return handlePeriodChange(widget, newPeriod);
                    }}
                >
                    <SelectTrigger
                        className={cn(
                            'mc-px-2 mc-py-1 mc-gap-1 mc-text-xs',
                            'mc-border mc-bg-white',
                            'hover:mc-shadow-none focus:mc-shadow-none',
                        )}
                        iconClassName={cn(
                            'mc-ml-1',
                        )}
                    >
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent
                        className={cn(
                            'mc-border mc-bg-white',
                        )}
                    >
                        {periodOptions.map((periodOptionGroup, groupIndex) => {
                            return (
                                <div key={`group-${groupIndex}`}>
                                    {periodOptionGroup.map((option) => {
                                        return (
                                            <SelectItem
                                                className="focus:mc-bg-slate-100"
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        );
                                    })}

                                    {groupIndex < periodOptions.length - 1 && (
                                        <SelectSeparator />
                                    )}
                                </div>
                            );
                        })}
                    </SelectContent>
                </Select>

                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger
                        className="focus:mc-shadow-none"
                        asChild
                    >
                        <Button
                            variant="outline"
                            size="icon"
                            className="mc-px-0.5 mc-py-1 mc-rounded -mc-mr-0.5 mc-border-transparent mc-text-slate-500 hover:mc-bg-white focus-visible:mc-ring-0"
                        >
                            <EllipsisVerticalIcon className="mc-size-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onSelect={(e) => {
                                setTimeout(() => {
                                    setIsDialogOpen(true);
                                }, 100);
                            }}
                        >
                            {Craft.t('metrix', 'Settings')}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onSelect={() => {
                                return handleDuplicate(widget);
                            }}
                        >
                            {Craft.t('metrix', 'Duplicate')}
                        </DropdownMenuItem>

                        <DropdownMenuItem className="focus:mc-bg-white mc-gap-4" onSelect={(e) => {
                            return e.preventDefault();
                        }}>
                            {Craft.t('metrix', 'Column Size')}

                            <WidthPicker
                                value={widget.data.width}
                                onChange={(newWidth) => {
                                    return handleWidthChange(widget, newWidth);
                                }}
                            />
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            className="mc-text-red-600 focus:mc-bg-red-50"
                            onSelect={() => {
                                return handleRemove(widget);
                            }}
                        >
                            {Craft.t('metrix', 'Delete')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <WidgetSettings
                            widget={widget}
                            onClose={() => {
                                return setIsDialogOpen(false);
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
