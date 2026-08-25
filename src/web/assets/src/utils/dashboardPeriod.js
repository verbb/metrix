import useAppStore from '@dashboard/hooks/useAppStore';

/**
 * Match PHP Widget::getInheritPeriod() — explicit false opts out of the header range.
 */
export function widgetInheritsDashboardPeriod(widget) {
    const { inheritPeriod, period } = widget?.data || {};

    if (inheritPeriod === null || inheritPeriod === undefined) {
        return period == null;
    }

    return Boolean(inheritPeriod);
}

/**
 * Build widget-data request params.
 * Dashboard `globalPeriod` is sent only when the widget inherits the view date range.
 */
export function getWidgetDataParams(widget, { refresh = false } = {}) {
    const { globalPeriod } = useAppStore.getState();
    const params = { id: widget.data.id };

    if (refresh) {
        params.refresh = true;
    }

    if (globalPeriod && widgetInheritsDashboardPeriod(widget)) {
        params.globalPeriod = globalPeriod;
    }

    return params;
}
