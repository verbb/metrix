import { useState, useCallback, useRef } from 'react';

export function useCustomTooltip() {
    const tooltipRef = useRef(null);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

    const customTooltip = useCallback((context, data, widget) => {
        // Prevent re-rendering getting out of control if nothing has changed
        if (context.replay) {
            return;
        }

        if (context.tooltip.opacity === 0) {
            setTooltipVisible(false);
            return;
        }

        const { chart } = context;
        const { canvas, chartArea } = chart;
        const mouseX = context.tooltip.caretX;
        const mouseY = context.tooltip.caretY;

        if (canvas && tooltipRef.current) {
            setTooltipVisible(true);

            // Dynamically calculate dimensions
            const tooltipWidth = tooltipRef.current.offsetWidth || 0;
            const tooltipHeight = tooltipRef.current.offsetHeight || 0;

            let left = mouseX;
            let top = mouseY;

            // Handle right edge
            if (left + tooltipWidth > chartArea.right) {
                left = mouseX - tooltipWidth;

                if (left < chartArea.left) {
                    left = chartArea.left;
                }
            }

            // Handle bottom edge
            if (top + tooltipHeight > chartArea.bottom) {
                top = mouseY - tooltipHeight;

                if (top < chartArea.top) {
                    top = chartArea.top;
                }
            }

            setTooltipPos({ top, left });

            setTooltipData({
                chartData: data,
                widget,
                tooltipModel: context.tooltip,
            });
        }
    }, []);

    return {
        tooltipRef,
        tooltipVisible,
        tooltipData,
        tooltipPos,
        customTooltip,
    };
}
