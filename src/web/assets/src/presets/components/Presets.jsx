import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

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
    arrayMove,
    useSortable,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

import {
    Button,
    Dialog,
    Icon,
} from '@verbb/plugin-kit-react/components';

import { WidthPicker } from '@components/WidthPicker';

import { PresetNew } from '@presets/components/PresetNew';
import { PresetSettings } from '@presets/components/PresetSettings';

import { cn } from '@utils';

const DragHandleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="size-4" aria-hidden="true">
        <path d="M71.3 295.6c-21.9-21.9-21.9-57.3 0-79.2s57.3-21.9 79.2 0 21.9 57.3 0 79.2s-57.4 21.9-79.2 0zM184.4 182.5c-21.9-21.9-21.9-57.3 0-79.2s57.3-21.9 79.2 0 21.9 57.3 0 79.2-57.3 21.8-79.2 0zm0 147c21.9-21.9 57.3-21.9 79.2 0s21.9 57.3 0 79.2s-57.3 21.9-79.2 0c-21.9-21.8-21.9-57.3 0-79.2zM297.5 216.4c21.9-21.9 57.3-21.9 79.2 0s21.9 57.3 0 79.2s-57.3 21.9-79.2 0c-21.8-21.9-21.8-57.3 0-79.2z" />
    </svg>
);

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
        <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.606 7.606 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5z" clipRule="evenodd" />
    </svg>
);

const RemoveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="size-4" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

const PresetWidgetRow = ({
    widget,
    handleWidthChange,
    handleRemove,
    handleEdit,
    dragHandleProps = null,
}) => {
    function titleCase(str) {
        return str
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/([0-9])([a-zA-Z])/g, '$1 $2')
            .replace(/([a-zA-Z])([0-9])/g, '$1 $2')
            .split(/[\s-_\\]+/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    function formatPeriod(period) {
        const lastSegment = period.split('\\').pop();
        return titleCase(lastSegment);
    }

    const dimension = () => {
        if (widget.data.dimensionLabel) {
            return widget.data.dimensionLabel;
        }

        return titleCase(widget.data.dimension);
    };

    const metric = () => {
        if (widget.data.metricLabel) {
            return widget.data.metricLabel;
        }

        if (widget.data.metric) {
            return titleCase(widget.data.metric);
        }

        return widget.component?.meta?.metricLabel || '';
    };

    const period = () => {
        if (widget.data.periodLabel) {
            return widget.data.periodLabel;
        }

        return formatPeriod(widget.data.period);
    };

    return (
        <div className="metrix-preset-widget-row flex items-start gap-2">
            <div className="shrink-0 text-gray-400">
                <Icon icon={widget.component.meta.icon} className="size-5" />
            </div>

            <div className="min-w-0 flex-1">
                <div className="text-sm font-medium leading-tight">
                    {widget.data.dimension && `${dimension()} - `}
                    {metric()}
                </div>

                <div className="text-xs font-medium text-gray-400">
                    {widget.component.meta.name}
                    {widget.data.period && ` - ${period()}`}
                </div>
            </div>

            <div className="metrix-preset-widget-row__actions">
                <WidthPicker
                    value={widget.data.width}
                    onChange={handleWidthChange}
                />

                <button
                    type="button"
                    className="metrix-preset-widget-row__btn metrix-preset-widget-row__btn--drag"
                    title={Craft.t('metrix', 'Drag to reorder')}
                    aria-label={Craft.t('metrix', 'Drag to reorder')}
                    {...dragHandleProps}
                >
                    <DragHandleIcon />
                </button>

                <button
                    type="button"
                    className="metrix-preset-widget-row__btn"
                    title={Craft.t('metrix', 'Edit Widget')}
                    aria-label={Craft.t('metrix', 'Edit Widget')}
                    onClick={handleEdit}
                >
                    <SettingsIcon />
                </button>

                <button
                    type="button"
                    className="metrix-preset-widget-row__btn metrix-preset-widget-row__btn--danger"
                    title={Craft.t('metrix', 'Remove Widget')}
                    aria-label={Craft.t('metrix', 'Remove Widget')}
                    onClick={handleRemove}
                >
                    <RemoveIcon />
                </button>
            </div>
        </div>
    );
};

const DraggableWidgetRow = ({
    widget,
    handleWidthChange,
    handleRemove,
    handleEdit,
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
                'metrix-preset-widget-sortable',
                isDragging && 'metrix-preset-widget-sortable--dragging',
            )}
        >
            <PresetWidgetRow
                widget={widget}
                handleWidthChange={handleWidthChange}
                handleRemove={handleRemove}
                handleEdit={handleEdit}
                dragHandleProps={{ ...attributes, ...listeners }}
            />
        </div>
    );
};

export const Presets = ({ widgets: initialWidgets }) => {
    const [widgets, setWidgets] = useState(initialWidgets);
    const [editingWidget, setEditingWidget] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { delay: 0, tolerance: 5 } }),
        useSensor(KeyboardSensor),
    );

    const handleDragEnd = ({ active, over }) => {
        if (active.id !== over?.id) {
            const currentIndex = widgets.findIndex((w) => w.__id === active.id);
            const newIndex = widgets.findIndex((w) => w.__id === over.id);
            setWidgets(arrayMove(widgets, currentIndex, newIndex));
        }
    };

    const handleWidthChange = (widget, newWidth) => {
        setWidgets((prevWidgets) => prevWidgets.map((w) => (
            w.__id === widget.__id
                ? { ...w, data: { ...w.data, width: newWidth } }
                : w
        )));
    };

    const handleRemove = (widget) => {
        setWidgets((prevWidgets) => prevWidgets.filter((w) => w.__id !== widget.__id));
    };

    const handleAddNew = (newWidget) => {
        // PresetSettings already returns a preloaded widget; just ensure a stable sortable id.
        setWidgets((prevWidgets) => [
            ...prevWidgets,
            {
                ...newWidget,
                __id: newWidget.__id || nanoid(),
            },
        ]);
    };

    const handleSave = (updatedWidget) => {
        setWidgets((prev) => prev.map((w) => (
            w.__id === updatedWidget.__id ? updatedWidget : w
        )));
        setEditingWidget(null);
    };

    useEffect(() => {
        const hiddenInput = document.querySelector('.metrix-presets-store');

        if (hiddenInput) {
            hiddenInput.value = JSON.stringify(widgets.map((widget) => widget.data));
        }
    }, [widgets]);

    return (
        <div>
            <div className="mb-4">
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
                                    handleEdit={() => setEditingWidget(widget)}
                                    handleWidthChange={(newWidth) => handleWidthChange(widget, newWidth)}
                                    handleRemove={() => handleRemove(widget)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            <PresetNew onAdd={handleAddNew} />

            <Dialog
                className="metrix-widget-settings-dialog"
                open={Boolean(editingWidget)}
                label={Craft.t('metrix', 'Widget Settings')}
                onPkOpenChange={(event) => {
                    if (!event.detail?.open) {
                        setEditingWidget(null);
                    }
                }}
            >
                {editingWidget ? (
                    <PresetSettings
                        widget={editingWidget}
                        onClose={() => setEditingWidget(null)}
                        onSave={handleSave}
                    />
                ) : null}
            </Dialog>
        </div>
    );
};
