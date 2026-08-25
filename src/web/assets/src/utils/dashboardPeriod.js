import useAppStore from '@dashboard/hooks/useAppStore';

/**
 * Build widget-data request params. When `globalPeriod` is set in the header it
 * overrides every widget for the session; otherwise each widget uses its own period.
 */
export function getWidgetDataParams(widget, { refresh = false } = {}) {
    const { globalPeriod } = useAppStore.getState();
    const params = { id: widget.data.id };

    if (refresh) {
        params.refresh = true;
    }

    if (globalPeriod) {
        params.globalPeriod = globalPeriod;
    }

    return params;
}
