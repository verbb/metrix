import { useState } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@components/ui/Select';

import {
    Dialog,
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
import { WidgetSettings } from '@components/widget/WidgetSettings';
import { WidthPicker } from '@components/WidthPicker';

import useWidgetStore from '@hooks/useWidgetStore';

import { cn } from '@utils';

const options = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
];

export function WidgetHeader({ widget }) {
    const updateWidget = useWidgetStore((state) => { return state.updateWidget; });
    const removeWidget = useWidgetStore((state) => { return state.removeWidget; });

    const [isOpen, setIsOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className="mc-flex mc-flex-row mc-items-center">
            <div className="mc-font-bold mc-text-slate-600 mc-truncate mc-mr-4">
                {widget.dimensionLabel && `${widget.dimensionLabel} - `}
                {widget.metricLabel}
            </div>

            <div className="mc-flex mc-flex-row mc-items-center mc-flex-shrink-0 mc-gap-1 mc-ml-auto">
                <Select
                    value={widget.period}
                    onValueChange={(newPeriod) => {
                        const option = options.find((option) => {
                            return option.value === newPeriod;
                        });

                        updateWidget(widget.__id, {
                            period: newPeriod,
                            periodLabel: option?.label,
                        });
                    }}
                >
                    <SelectTrigger
                        className={cn(
                            'mc-px-2 mc-py-1 mc-gap-1 mc-text-xs',
                            'mc-border mc-bg-white',
                            'hover:mc-shadow-none focus:mc-shadow-none',
                        )}
                    >
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent
                        className={cn(
                            'mc-border mc-bg-white',
                        )}
                    >
                        {options.map((option) => {
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
                                setIsDialogOpen(true);
                            }}
                        >
                        Settings
                        </DropdownMenuItem>

                        <DropdownMenuItem className="focus:mc-bg-white mc-gap-4" onSelect={(e) => {
                            return e.preventDefault();
                        }}>
                            Column Size

                            <WidthPicker
                                value={widget.width}
                                onChange={(newWidth) => {
                                    updateWidget(widget.__id, { width: newWidth });
                                    setIsOpen(false);
                                }}
                            />
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onSelect={() => {
                                const confirmation = window.confirm(
                                    'Are you sure you want to delete this widget? This action cannot be undone.',
                                );

                                if (confirmation) {
                                    removeWidget(widget.__id);
                                }
                            }}
                            className="mc-text-red-600 focus:mc-bg-red-50"
                        >
                        Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    {isDialogOpen && (
                        <WidgetSettings
                            widget={widget}
                            onClose={() => {
                                return setIsDialogOpen(false);
                            }}
                        />
                    )}
                </Dialog>
            </div>
        </div>
    );
}
