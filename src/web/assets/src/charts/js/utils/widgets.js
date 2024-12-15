import { BarWidget } from '@components/widgets/BarWidget';
import { CounterWidget } from '@components/widgets/CounterWidget';
import { LineWidget } from '@components/widgets/LineWidget';
import { PieWidget } from '@components/widgets/PieWidget';
import { TableWidget } from '@components/widgets/TableWidget';

const typeToComponentMap = {
    'verbb\\metrix\\widgets\\Line': LineWidget,
    'verbb\\metrix\\widgets\\Counter': CounterWidget,
    'verbb\\metrix\\widgets\\Bar': BarWidget,
    'verbb\\metrix\\widgets\\Pie': PieWidget,
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
