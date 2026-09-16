import { lazy } from 'react';
import { WIDGET_ICONS } from '@icons/widgetIcons';

const BarWidget = lazy(() => import('@dashboard/components/widgets/BarWidget').then((module) => ({ default: module.BarWidget })));
const CounterWidget = lazy(() => import('@dashboard/components/widgets/CounterWidget').then((module) => ({ default: module.CounterWidget })));
const LineWidget = lazy(() => import('@dashboard/components/widgets/LineWidget').then((module) => ({ default: module.LineWidget })));
const PieWidget = lazy(() => import('@dashboard/components/widgets/PieWidget').then((module) => ({ default: module.PieWidget })));
const RealtimeWidget = lazy(() => import('@dashboard/components/widgets/RealtimeWidget').then((module) => ({ default: module.RealtimeWidget })));
const TableWidget = lazy(() => import('@dashboard/components/widgets/TableWidget').then((module) => ({ default: module.TableWidget })));

const typeToComponentMap = {
    'verbb\\metrix\\widgets\\Line': LineWidget,
    'verbb\\metrix\\widgets\\Counter': CounterWidget,
    'verbb\\metrix\\widgets\\Bar': BarWidget,
    'verbb\\metrix\\widgets\\Pie': PieWidget,
    'verbb\\metrix\\widgets\\Realtime': RealtimeWidget,
    'verbb\\metrix\\widgets\\Table': TableWidget,
};

// Preset rows need labels and icons without loading the chart implementations.
for (const [type, component] of Object.entries(typeToComponentMap)) {
    const name = type.split('\\').pop();
    component.meta = {
        name,
        icon: WIDGET_ICONS[name === 'Realtime' ? 'counter' : name.toLowerCase()],
    };
}

/** Resolve the React widget from persisted server type (source of truth on the dashboard). */
export const getWidgetComponent = (type) => {
    return Craft.Metrix.Config.getRegisteredWidget(type) || typeToComponentMap[type] || null;
};

// Preload a single widget. Optional extras (e.g. `__id`) are merged onto the result.
export const preloadWidget = (widget, extras = {}) => {
    return {
        component: getWidgetComponent(widget.type),
        data: widget,
        ...extras,
    };
};

// Preload multiple widgets
export const preloadWidgets = (widgetData) => {
    return widgetData.map((widget) => {
        return preloadWidget(widget);
    });
};
