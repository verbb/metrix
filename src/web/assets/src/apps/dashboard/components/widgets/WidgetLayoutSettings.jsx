import { useRef, useState } from 'react';

import {
    DndContext,
    DragOverlay,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
} from '@dnd-kit/core';

import {
    restrictToVerticalAxis,
    restrictToParentElement,
} from '@dnd-kit/modifiers';

import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
    useSortable,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';
import { Cog8ToothIcon } from '@heroicons/react/24/solid';
import { X } from 'lucide-react';

import { Button } from '@components/ui/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/Popover';
import { WidthPicker } from '@components/WidthPicker';

import useWidgetStore from '@dashboard/hooks/useWidgetStore';

import { cn, api } from '@utils';

const DraggableWidgetRow = ({
    widget,
    handleWidthChange,
    handleRemove,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: widget.__id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'mc-flex mc-items-start mc-gap-2',
            )}
        >
            <div className="mc-text-slate-400">
                <widget.component.meta.icon className="mc-size-5" />
            </div>

            <div className="mc-flex-1">
                <div className="mc-text-sm mc-font-medium mc-leading-tight">
                    {widget.data.dimensionLabel && `${widget.data.dimensionLabel} - `}
                    {widget.data.metricLabel}
                </div>

                <div className="mc-text-xs mc-text-slate-400 mc-font-medium">
                    {widget.component.meta.name} - {widget.data.periodLabel}
                </div>
            </div>

            <div className="mc-pt-0.5">
                <WidthPicker
                    value={widget.data.width}
                    onChange={(newWidth) => {
                        return handleWidthChange(newWidth);
                    }}
                />
            </div>

            <div
                {...attributes}
                {...listeners}
                className="mc-pt-0.5"
            >
                <Button variant="clear" size="icon" className="mc-p-0 mc-text-slate-500 hover:mc-text-blue-500 mc-cursor-move" type="button" title="Settings" aria-label="Settings">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
                        <path d="M71.3 295.6c-21.9-21.9-21.9-57.3 0-79.2s57.3-21.9 79.2 0 21.9 57.3 0 79.2s-57.4 21.9-79.2 0zM184.4 182.5c-21.9-21.9-21.9-57.3 0-79.2s57.3-21.9 79.2 0 21.9 57.3 0 79.2-57.3 21.8-79.2 0zm0 147c21.9-21.9 57.3-21.9 79.2 0s21.9 57.3 0 79.2s-57.3 21.9-79.2 0c-21.9-21.8-21.9-57.3 0-79.2zM297.5 216.4c21.9-21.9 57.3-21.9 79.2 0s21.9 57.3 0 79.2s-57.3 21.9-79.2 0c-21.8-21.9-21.8-57.3 0-79.2z"/>
                    </svg>
                </Button>
            </div>

            <div className="mc-pt-0.5">
                <Button
                    variant="clear"
                    size="icon"
                    className="mc-p-0 mc-text-slate-500 hover:mc-text-red-500"
                    type="button"
                    title={Craft.t('metrix', 'Remove Widget')}
                    aria-label={Craft.t('metrix', 'Remove Widget')}
                    onClick={() => {
                        return handleRemove();
                    }}
                >
                    <X className="mc-size-4" strokeWidth="3" />
                </Button>
            </div>
        </div>
    );
};

export const WidgetLayoutSettings = () => {
    const widgets = useWidgetStore((state) => { return state.widgets; });
    const reorderWidgets = useWidgetStore((state) => { return state.reorderWidgets; });
    const updateWidget = useWidgetStore((state) => { return state.updateWidget; });
    const removeWidget = useWidgetStore((state) => { return state.removeWidget; });
    const removingWidgets = useWidgetStore((state) => { return state.removingWidgets; });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { delay: 0, tolerance: 5 } }),
        useSensor(KeyboardSensor),
    );

    const handleDragEnd = async({ active, over }) => {
        if (active.id !== over.id) {
            const sourceWidget = widgets.find((widget) => { return widget.__id === active.id; });
            const targetWidget = widgets.find((widget) => { return widget.__id === over.id; });

            if (sourceWidget && targetWidget) {
                await reorderWidgets(sourceWidget, targetWidget);
            }
        }
    };

    const handleWidthChange = (widget, newWidth) => {
        updateWidget(widget, { width: newWidth }, false);
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
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="secondary" size="icon" type="button" title="Settings" aria-label="Settings">
                    <Cog8ToothIcon className="mc-size-4" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                side="left"
                sideOffset={3}
                align="start"
                className="mc-w-auto mc-p-0"
            >
                <div className="mc-w-[400px] mc-max-h-[600px] mc-p-4 mc-overflow-y-auto mc-overflow-x-hidden">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            strategy={verticalListSortingStrategy}
                            items={widgets.map((widget) => {
                                return widget.__id;
                            })}
                        >
                            <div className="mc-flex mc-flex-col mc-gap-4">
                                {widgets.map((widget) => {
                                    return (
                                        <DraggableWidgetRow
                                            key={widget.__id}
                                            widget={widget}
                                            handleWidthChange={(newWidth) => {
                                                return handleWidthChange(widget, newWidth);
                                            }}
                                            handleRemove={() => {
                                                return handleRemove(widget);
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            </PopoverContent>
        </Popover>
    );
};
