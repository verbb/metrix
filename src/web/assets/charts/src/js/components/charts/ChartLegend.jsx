import {
    useState, useEffect, useRef, useCallback,
} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@components/ui/Button';

import { cn } from '@utils';

const LEGEND_HEIGHT = 50;

export const ChartLegend = ({
    chartRef, // Reference to the chart instance
    legendItems, // Legend items from the chart
    onLegendToggle, // Callback for when a legend item is toggled
    containerWidth = '75%', // Default container width
    containerHeight = LEGEND_HEIGHT, // Default container height
}) => {
    const legendContainerRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // const calculateTotalPages = () => {
    //     if (!legendContainerRef.current) {
    //         return;
    //     }

    //     const { scrollHeight } = legendContainerRef.current;

    //     setTotalPages(Math.ceil(scrollHeight / containerHeight));
    // };

    const calculateTotalPages = useCallback(() => {
        if (!legendContainerRef.current) {
            return;
        }

        const { scrollHeight } = legendContainerRef.current;

        setTotalPages(Math.ceil(scrollHeight / containerHeight));
    }, [containerHeight]);

    // useEffect(() => {
    //     calculateTotalPages();

    //     window.addEventListener('resize', calculateTotalPages);

    //     return () => {
    //         window.removeEventListener('resize', calculateTotalPages);
    //     };
    // }, [legendItems]);

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
                // Pie and doughnut charts only have a single dataset and visibility is per item
                chartRef.current.toggleDataVisibility(index);
            } else {
                // chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
            }

            chartRef.current.update();
        }

        if (onLegendToggle) {
            onLegendToggle(index);
        }
    };

    return (
        <div className="mc-absolute mc-bottom-0 mc-w-full mc-pb-8">
            <div className="mc-flex mc-items-center">
                {totalPages > 1 && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="mc-px-1 mc-py-0.5"
                        disabled={currentPage === 0}
                        onClick={() => {
                            return setCurrentPage((prev) => {
                                return Math.max(prev - 1, 0);
                            });
                        }}
                    >
                        <ChevronLeft />
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
                        className="mc-flex mc-items-center mc-justify-center mc-flex-wrap mc-gap-x-3"
                        style={{
                            transform: `translateY(-${currentPage * LEGEND_HEIGHT}px)`,
                        }}
                    >
                        {legendItems.map((item, index) => {
                            return (
                                <div
                                    key={item.text}
                                    className={cn(
                                        'mc-flex mc-text-xs mc-items-center mc-gap-1.5 mc-shrink-0 mc-cursor-pointer',
                                        item.hidden ? 'mc-opacity-50' : '',
                                    )}
                                    style={{
                                        height: `${LEGEND_HEIGHT / 2}px`,
                                    }}
                                    onClick={() => {
                                        return handleToggle(index);
                                    }}
                                >
                                    <div
                                        className="mc-h-2.5 mc-w-2.5 mc-shrink-0 mc-rounded-full"
                                        style={{ background: item.fillStyle }}
                                    ></div>
                                    {item.text}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {totalPages > 1 && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="mc-px-1 mc-py-0.5"
                        disabled={currentPage >= totalPages - 1}
                        onClick={() => {
                            return setCurrentPage((prev) => {
                                return Math.min(prev + 1, totalPages - 1);
                            });
                        }}
                    >
                        <ChevronRight />
                    </Button>
                )}
            </div>
        </div>
    );
};
