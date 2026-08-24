import { useState } from 'react';

import {
    DndContext,
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
    useSortable,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

import {
    Button,
    Icon,
    Popover,
} from '@verbb/plugin-kit-react/components';

import { WidthPicker } from '@components/WidthPicker';

import useWidgetStore from '@dashboard/hooks/useWidgetStore';

import { cn } from '@utils';

/** Legacy Lucide X — stroke icon used in presets + layout settings (not filled xmark). */
const RemoveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="size-4" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

const WidgetLayoutRow = ({
    widget,
    handleWidthChange,
    handleRemove,
    dragHandleProps = null,
    className,
}) => (
    <div className={cn('metrix-layout-settings-row flex items-start gap-2', className)}>
        <div className="shrink-0 text-gray-400">
            <Icon icon={widget.component.meta.icon} className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
            <div className="text-sm font-medium leading-tight">
                {widget.data.dimensionLabel && `${widget.data.dimensionLabel} - `}
                {widget.data.metricLabel}
            </div>

            <div className="text-xs font-medium text-gray-400">
                {widget.component.meta.name} - {widget.data.periodLabel}
            </div>
        </div>

        <div className="metrix-layout-settings-row__actions">
            <WidthPicker
                value={widget.data.width}
                onChange={handleWidthChange}
            />

            <button
                type="button"
                className="metrix-layout-settings-row__btn metrix-layout-settings-row__btn--drag"
                title={Craft.t('metrix', 'Drag to reorder')}
                aria-label={Craft.t('metrix', 'Drag to reorder')}
                {...dragHandleProps}
            >
                <Icon icon="grip-move" className="size-4" />
            </button>

            <button
                type="button"
                className="metrix-layout-settings-row__btn metrix-layout-settings-row__btn--danger"
                title={Craft.t('metrix', 'Remove Widget')}
                aria-label={Craft.t('metrix', 'Remove Widget')}
                onClick={handleRemove}
            >
                <RemoveIcon />
            </button>
        </div>
    </div>
);

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
        isDragging,
    } = useSortable({ id: widget.__id });

    const style = {
        // Translate only — Transform includes scaleY during sort, which squashes taller rows.
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'metrix-layout-settings-sortable',
                isDragging && 'metrix-layout-settings-sortable--dragging',
            )}
        >
            <WidgetLayoutRow
                widget={widget}
                handleWidthChange={handleWidthChange}
                handleRemove={handleRemove}
                dragHandleProps={{ ...attributes, ...listeners }}
            />
        </div>
    );
};

export const WidgetLayoutSettings = () => {
    const widgets = useWidgetStore((state) => state.widgets);
    const reorderWidgets = useWidgetStore((state) => state.reorderWidgets);
    const updateWidget = useWidgetStore((state) => state.updateWidget);
    const removeWidget = useWidgetStore((state) => state.removeWidget);

    const [isOpen, setIsOpen] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { delay: 0, tolerance: 5 } }),
        useSensor(KeyboardSensor),
    );

    const handleDragEnd = async({ active, over }) => {
        if (active.id !== over?.id) {
            const sourceWidget = widgets.find((widget) => widget.__id === active.id);
            const targetWidget = widgets.find((widget) => widget.__id === over?.id);

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
        <Popover
            open={isOpen}
            placement="left-start"
            sideOffset={3}
            flush
            withArrow
            className="metrix-layout-settings-popover"
            onPkOpenChange={(event) => {
                const nextOpen = Boolean(event.detail?.open ?? event.target?.open);

                setIsOpen(nextOpen);
            }}
        >
            <Button
                slot="trigger"
                type="button"
                variant="default"
                className="metrix-layout-settings-trigger"
                title={Craft.t('metrix', 'Layout settings')}
                aria-label={Craft.t('metrix', 'Layout settings')}
            >
                <Icon icon="gear" />
            </Button>

            <div className="metrix-layout-settings-panel">
                {isOpen ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            strategy={verticalListSortingStrategy}
                            items={widgets.map((widget) => widget.__id)}
                        >
                            <div className="flex flex-col gap-4">
                                {widgets.map((widget) => (
                                    <DraggableWidgetRow
                                        key={widget.__id}
                                        widget={widget}
                                        handleWidthChange={(newWidth) => handleWidthChange(widget, newWidth)}
                                        handleRemove={() => handleRemove(widget)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : null}
            </div>
        </Popover>
    );
};
