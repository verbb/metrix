import { useRef, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

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
import { X } from 'lucide-react';
import { Cog8ToothIcon } from '@heroicons/react/24/solid';

import { Dialog, DialogTrigger, DialogContent } from '@components/ui/Dialog';
import { Button } from '@components/ui/Button';
import { WidthPicker } from '@components/WidthPicker';

import { PresetNew } from '@presets/components/PresetNew';
import { PresetSettings } from '@presets/components/PresetSettings';

import { cn } from '@utils';

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
    } = useSortable({ id: widget.__id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // Because we can't guarantee a source being set yet, we can't dynamically fetch the labels of metrics, etc.
    function titleCase(str) {
        return str
            .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase letters
            .replace(/([0-9])([a-zA-Z])/g, '$1 $2') // Add space between numbers and letters
            .replace(/([a-zA-Z])([0-9])/g, '$1 $2') // Add space between letters and numbers
            .split(/[\s-_\\]+/) // Split on spaces, hyphens, underscores, or backslashes
            .map((word) => { return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); }) // Capitalize each word
            .join(' '); // Join back with spaces
    }

    function formatPeriod(period) {
        const lastSegment = period.split('\\').pop(); // Get the last part after the backslashes

        return titleCase(lastSegment); // Apply titleCase logic to the extracted segment
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

        return titleCase(widget.data.metric);
    };

    const period = () => {
        if (widget.data.periodLabel) {
            return widget.data.periodLabel;
        }

        return formatPeriod(widget.data.period);
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
                    {widget.data.dimension && `${dimension()} - `}
                    {metric()}
                </div>

                <div className="mc-text-xs mc-text-slate-400 mc-font-medium">
                    {widget.component.meta.name} - {period()}
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
                    className="mc-p-0 mc-text-slate-500 hover:mc-text-blue-500"
                    type="button"
                    title={Craft.t('metrix', 'Edit Widget')}
                    aria-label={Craft.t('metrix', 'Edit Widget')}
                    onClick={() => {
                        return handleEdit();
                    }}
                >
                    <Cog8ToothIcon className="mc-size-4" />
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

import { preloadWidget } from '@utils/widgets';

export const Presets = ({ widgets: initialWidgets }) => {
    const [widgets, setWidgets] = useState(initialWidgets);

    const [editingWidget, setEditingWidget] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { delay: 0, tolerance: 5 } }),
        useSensor(KeyboardSensor),
    );

    const handleDragEnd = ({ active, over }) => {
        if (active.id !== over.id) {
            const currentIndex = widgets.findIndex((w) => { return w.__id === active.id; });
            const newIndex = widgets.findIndex((w) => { return w.__id === over.id; });

            const reorderedWidgets = arrayMove(widgets, currentIndex, newIndex);

            setWidgets(reorderedWidgets);
        }
    };

    const handleWidthChange = (widget, newWidth) => {
        setWidgets((prevWidgets) => {
            return prevWidgets.map((w) => {
                return (w.__id === widget.__id
                    ? { ...w, data: { ...w.data, width: newWidth } }
                    : w);
            });
        });
    };

    const handleRemove = (widget) => {
        setWidgets((prevWidgets) => { return prevWidgets.filter((w) => { return w.__id !== widget.__id; }); });
    };

    const handleEdit = (widget) => {
        setEditingWidget(widget);
    };

    const handleAddNew = (newWidget) => {
        setWidgets((prevWidgets) => {
            return [
                ...prevWidgets,
                preloadWidget(newWidget.data, { __id: nanoid() }),
            ];
        });
    };

    const handleSave = (updatedWidget) => {
        setWidgets((prev) => {
            return prev.map((w) => {
                return (w.__id === updatedWidget.__id ? updatedWidget : w);
            });
        });

        setEditingWidget(null);
    };

    const handleCloseSettings = () => {
        setEditingWidget(null);
    };

    // Directly update the hidden input whenever widgets change
    useEffect(() => {
        const hiddenInput = document.querySelector('.metrix-presets-store');

        if (hiddenInput) {
            hiddenInput.value = JSON.stringify(widgets.map((widget) => {
                return widget.data;
            }));
        }
    }, [widgets]);

    return (
        <div>
            <div className="mc-mb-4">
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
                                        handleEdit={() => {
                                            return handleEdit(widget);
                                        }}
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

            <PresetNew onAdd={handleAddNew} />

            {editingWidget && (
                <Dialog open={Boolean(editingWidget)} onOpenChange={() => { return setEditingWidget(null); }}>
                    <DialogContent>
                        <PresetSettings
                            widget={editingWidget}
                            onClose={() => { return setEditingWidget(null); }}
                            onSave={handleSave}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};
