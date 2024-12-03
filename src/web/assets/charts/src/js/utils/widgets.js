import { BarWidget } from '@widgets/BarWidget';
import { CounterWidget } from '@widgets/CounterWidget';
import { LineWidget } from '@widgets/LineWidget';
import { PieWidget } from '@widgets/PieWidget';
import { TableWidget } from '@widgets/TableWidget';

// Preload the widgets here, rather than in the store, otherwise we get cyclical imports
// due to using the store in the below components. If I could figure out dynamic imports...
export const preloadWidget = (widget) => {
    const typeToComponentMap = {
        'verbb\\metrix\\widgets\\Line': LineWidget,
        'verbb\\metrix\\widgets\\Counter': CounterWidget,
        'verbb\\metrix\\widgets\\Bar': BarWidget,
        'verbb\\metrix\\widgets\\Pie': PieWidget,
        'verbb\\metrix\\widgets\\Table': TableWidget,
    };

    return {
        ...widget,
        component: typeToComponentMap[widget.type], // Map widget type to component
    };
};

export const preloadWidgets = (widgetData) => {
    return widgetData.map((widget) => {
        return preloadWidget(widget);
    });
};
