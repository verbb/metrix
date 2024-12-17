import { BarWidget } from '@dashboard/components/widgets/BarWidget';
import { CounterWidget } from '@dashboard/components/widgets/CounterWidget';
import { LineWidget } from '@dashboard/components/widgets/LineWidget';
import { PieWidget } from '@dashboard/components/widgets/PieWidget';
import { RealtimeWidget } from '@dashboard/components/widgets/RealtimeWidget';
import { TableWidget } from '@dashboard/components/widgets/TableWidget';

const typeToComponentMap = {
    'verbb\\metrix\\widgets\\Line': LineWidget,
    'verbb\\metrix\\widgets\\Counter': CounterWidget,
    'verbb\\metrix\\widgets\\Bar': BarWidget,
    'verbb\\metrix\\widgets\\Pie': PieWidget,
    'verbb\\metrix\\widgets\\Realtime': RealtimeWidget,
    'verbb\\metrix\\widgets\\Table': TableWidget,
};

// Preload a single widget
export const preloadWidget = (widget) => {
    const component = typeToComponentMap[widget.type] || null;

    return {
        component,
        data: widget,
    };
};

// Preload multiple widgets
export const preloadWidgets = (widgetData) => {
    return widgetData.map((widget) => {
        return preloadWidget(widget);
    });
};
