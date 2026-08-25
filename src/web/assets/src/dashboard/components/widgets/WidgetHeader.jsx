import { useState } from 'react';

import {
    Button,
    Dialog,
    DropdownItem,
    DropdownMenu,
    DropdownSeparator,
    Icon,
} from '@verbb/plugin-kit-react/components';

import { GroupedPeriodSelect } from '@components/GroupedPeriodSelect';
import { WidgetSettings } from '@dashboard/components/widgets/WidgetSettings';
import { WidthPicker } from '@components/WidthPicker';

import useAppStore from '@dashboard/hooks/useAppStore';
import useWidgetStore from '@dashboard/hooks/useWidgetStore';
import useWidgetSettingsStore from '@dashboard/hooks/useWidgetSettingsStore';

import { widgetInheritsDashboardPeriod } from '@utils/dashboardPeriod';

function formatFreshness(meta) {
    if (!meta?.fetchedAt) {
        return null;
    }

    const seconds = Math.max(0, Math.floor(Date.now() / 1000) - Number(meta.fetchedAt));
    let age;

    if (seconds < 45) {
        age = Craft.t('metrix', 'just now');
    } else if (seconds < 3600) {
        const minutes = Math.max(1, Math.round(seconds / 60));
        age = Craft.t('metrix', '{n,plural,=1{# min ago} other{# mins ago}}', { n: minutes });
    } else if (seconds < 86400) {
        const hours = Math.max(1, Math.round(seconds / 3600));
        age = Craft.t('metrix', '{n,plural,=1{# hour ago} other{# hours ago}}', { n: hours });
    } else {
        const days = Math.max(1, Math.round(seconds / 86400));
        age = Craft.t('metrix', '{n,plural,=1{# day ago} other{# days ago}}', { n: days });
    }

    // Keep copy client-facing — don’t expose cache vs live fetch.
    return Craft.t('metrix', 'Updated {age}', { age });
}

export function WidgetHeader({ widget }) {
    const duplicateWidget = useWidgetStore((state) => state.duplicateWidget);
    const updateWidget = useWidgetStore((state) => state.updateWidget);
    const removeWidget = useWidgetStore((state) => state.removeWidget);
    const refreshWidgetData = useWidgetStore((state) => state.refreshWidgetData);
    const periodOptions = useAppStore((state) => state.periodOptions);
    const globalPeriod = useAppStore((state) => state.globalPeriod);
    const getSettingsByType = useWidgetSettingsStore((state) => state.getSettingsByType);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const schema = getSettingsByType(widget.data.type, widget.data.source);
    const hasPeriodField = schema?.some((field) => field.name === 'period');
    const inheritsDashboard = widgetInheritsDashboardPeriod(widget);
    // While inheriting a header range, show that value in the select; picking another opts out.
    const periodSelectValue = (inheritsDashboard && globalPeriod)
        ? globalPeriod
        : widget.data.period;

    const displayTitle = widget.data.displayTitle
        || (widget.data.dimensionLabel
            ? `${widget.data.dimensionLabel} - ${widget.data.metricLabel}`
            : widget.data.metricLabel);
    const freshness = formatFreshness(widget.chartData?._meta);

    const handleWidthChange = (newWidth) => {
        updateWidget(widget, { width: newWidth }, false);
        setIsMenuOpen(false);
    };

    const handlePeriodChange = (newPeriod) => {
        if (!newPeriod) {
            return;
        }

        // Choosing a widget period opts out of the dashboard header range.
        updateWidget(widget, {
            period: newPeriod,
            inheritPeriod: false,
        });
    };

    const handleUseDashboardPeriod = () => {
        updateWidget(widget, { inheritPeriod: true });
        setIsMenuOpen(false);
    };

    const handleRefresh = async() => {
        setRefreshing(true);

        try {
            await refreshWidgetData(widget.__id);
        } finally {
            setRefreshing(false);
            setIsMenuOpen(false);
        }
    };

    const handleDuplicate = () => {
        duplicateWidget(widget);
    };

    const handleRemove = () => {
        const confirmation = window.confirm(
            Craft.t('metrix', 'Are you sure you want to delete this widget? This action cannot be undone.'),
        );

        if (confirmation) {
            removeWidget(widget);
        }
    };

    return (
        <div className="flex flex-row items-start relative z-[10] gap-2">
            <div className="min-w-0 flex-1">
                <div className="font-bold text-gray-600 truncate">
                    {displayTitle}
                </div>

                {widget.data.subtitle ? (
                    <div className="text-xs text-gray-500 truncate mt-0.5">
                        {widget.data.subtitle}
                    </div>
                ) : null}

                {freshness ? (
                    <div className="text-[11px] text-gray-400 truncate mt-0.5" title={freshness}>
                        {freshness}
                    </div>
                ) : null}
            </div>

            <div className="flex flex-row items-center flex-shrink-0 gap-1 metrix-widget-header-controls">
                {hasPeriodField && (
                    <GroupedPeriodSelect
                        className="metrix-widget-period-select"
                        periodOptions={periodOptions}
                        value={periodSelectValue}
                        size="xs"
                        onChange={handlePeriodChange}
                    />
                )}

                <DropdownMenu
                    className="metrix-widget-header-menu"
                    open={isMenuOpen}
                    placement="bottom-end"
                    onPkOpenChange={(event) => {
                        setIsMenuOpen(Boolean(event.detail?.open ?? event.target?.open));
                    }}
                >
                    <Button
                        slot="trigger"
                        type="button"
                        variant="default"
                        size="xs"
                        className="metrix-widget-menu-trigger"
                        aria-label={Craft.t('metrix', 'Widget actions')}
                    >
                        <Icon icon="ellipsis-vertical" />
                    </Button>

                    <DropdownItem
                        value="settings"
                        onPkSelect={() => {
                            setTimeout(() => {
                                setIsDialogOpen(true);
                            }, 100);
                        }}
                    >
                        {Craft.t('metrix', 'Settings')}
                    </DropdownItem>

                    <DropdownItem
                        value="refresh"
                        disabled={refreshing || widget.loading}
                        onPkSelect={handleRefresh}
                    >
                        {refreshing
                            ? Craft.t('metrix', 'Refreshing…')
                            : Craft.t('metrix', 'Refresh')}
                    </DropdownItem>

                    {hasPeriodField && globalPeriod && !inheritsDashboard ? (
                        <DropdownItem
                            value="use-dashboard-period"
                            onPkSelect={handleUseDashboardPeriod}
                        >
                            {Craft.t('metrix', 'Use dashboard date range')}
                        </DropdownItem>
                    ) : null}

                    <DropdownItem value="duplicate" onPkSelect={handleDuplicate}>
                        {Craft.t('metrix', 'Duplicate')}
                    </DropdownItem>

                    {/* Non-selectable row — only the width-picker columns are actionable. */}
                    <div className="metrix-widget-menu-width-row">
                        <span className="metrix-widget-menu-width-row__label">
                            {Craft.t('metrix', 'Column Size')}
                        </span>
                        <WidthPicker
                            value={widget.data.width}
                            onChange={handleWidthChange}
                        />
                    </div>

                    <DropdownSeparator />

                    <DropdownItem
                        value="delete"
                        destructive
                        onPkSelect={handleRemove}
                    >
                        {Craft.t('metrix', 'Delete')}
                    </DropdownItem>
                </DropdownMenu>

                <Dialog
                    className="metrix-widget-settings-dialog"
                    open={isDialogOpen}
                    label={Craft.t('metrix', 'Widget Settings')}
                    onPkOpenChange={(event) => {
                        setIsDialogOpen(Boolean(event.detail?.open));
                    }}
                >
                    {isDialogOpen ? (
                        <WidgetSettings
                            widget={widget}
                            onClose={() => setIsDialogOpen(false)}
                        />
                    ) : null}
                </Dialog>
            </div>
        </div>
    );
}
