import {
    useState, useEffect, useRef, useCallback,
} from 'react';

import { Button, Icon } from '@verbb/plugin-kit-react/components';

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
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const calculateTotalPages = useCallback(() => {
        if (!legendContainerRef.current) {
            return;
        }

        const { scrollHeight } = legendContainerRef.current;
        setTotalPages(Math.ceil(scrollHeight / containerHeight));
    }, [containerHeight]);

    useEffect(() => {
        calculateTotalPages();

        window.addEventListener('resize', calculateTotalPages);

        return () => {
            window.removeEventListener('resize', calculateTotalPages);
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
                        className="flex items-center justify-center flex-wrap gap-x-3"
                        style={{
                            transform: `translateY(-${currentPage * LEGEND_HEIGHT}px)`,
                        }}
                    >
                        {legendItems.map((item, index) => (
                            <div
                                key={item.text}
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
                            </div>
                        ))}
                    </div>
                </div>

                {totalPages > 1 && (
                    <Button
                        variant="outline"
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
