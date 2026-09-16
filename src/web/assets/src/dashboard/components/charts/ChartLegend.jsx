import {
    useState, useEffect, useRef, useCallback,
} from 'react';

import { Button } from '@verbb/plugin-kit-react/components/Button';
import { Icon } from '@verbb/plugin-kit-react/components/Icon';

import { cn } from '@utils';

const LEGEND_HEIGHT = 50;

export const ChartLegend = ({
    chartRef,
    legendItems,
    onLegendToggle,
    containerWidth = '75%',
    containerHeight = LEGEND_HEIGHT,
}) => {
    const legendContainerRef = useRef(null);
    const legendContentRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const calculateTotalPages = useCallback(() => {
        if (!legendContentRef.current) {
            return;
        }

        // Measure unshifted content, then keep the visible page inside its new bounds.
        const pages = Math.max(1, Math.ceil(legendContentRef.current.scrollHeight / containerHeight));
        setTotalPages(pages);
        setCurrentPage((page) => Math.min(page, pages - 1));
    }, [containerHeight]);

    useEffect(() => {
        calculateTotalPages();

        window.addEventListener('resize', calculateTotalPages);
        const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(calculateTotalPages);
        if (legendContainerRef.current) observer?.observe(legendContainerRef.current);
        if (legendContentRef.current) observer?.observe(legendContentRef.current);

        return () => {
            window.removeEventListener('resize', calculateTotalPages);
            observer?.disconnect();
        };
    }, [calculateTotalPages, legendItems]);

    const handleToggle = (index) => {
        if (chartRef.current) {
            const { type } = chartRef.current.config;

            if (type === 'pie' || type === 'doughnut') {
                chartRef.current.toggleDataVisibility(index);
            }

            chartRef.current.update();
        }

        onLegendToggle?.(index);
    };

    return (
        <div className="absolute bottom-0 w-full pb-8">
            <div className="flex items-center">
                {totalPages > 1 && (
                    <Button
                        variant="outline"
                        aria-label={Craft.t('metrix', 'Previous legend page')}
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                    >
                        <Icon icon="chevron-left" />
                    </Button>
                )}

                <div
                    ref={legendContainerRef}
                    style={{
                        height: `${containerHeight}px`,
                        overflow: 'hidden',
                        width: containerWidth,
                        margin: 'auto',
                    }}
                >
                    <div
                        ref={legendContentRef}
                        className="flex items-center justify-center flex-wrap gap-x-3"
                        style={{
                            transform: `translateY(-${currentPage * containerHeight}px)`,
                        }}
                    >
                        {legendItems.map((item, index) => (
                            <button
                                key={item.text}
                                type="button"
                                aria-pressed={!item.hidden}
                                className={cn(
                                    'flex text-xs items-center gap-1.5 shrink-0 cursor-pointer',
                                    item.hidden ? 'opacity-50' : '',
                                )}
                                style={{
                                    height: `${LEGEND_HEIGHT / 2}px`,
                                }}
                                onClick={() => handleToggle(index)}
                            >
                                <div
                                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                                    style={{ background: item.fillStyle }}
                                />
                                {item.text}
                            </button>
                        ))}
                    </div>
                </div>

                {totalPages > 1 && (
                    <Button
                        variant="outline"
                        aria-label={Craft.t('metrix', 'Next legend page')}
                        disabled={currentPage >= totalPages - 1}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                    >
                        <Icon icon="chevron-right" />
                    </Button>
                )}
            </div>
        </div>
    );
};
