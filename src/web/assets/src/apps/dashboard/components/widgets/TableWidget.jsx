import { useState, useCallback } from 'react';
import { TbTableFilled } from 'react-icons/tb';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@components/ui/Button';

import { WidgetLarge } from '@dashboard/components/widgets/WidgetLarge';

import {
    api, cn, format, chartFormat, sort,
} from '@utils';

const MAX_ITEMS = 9;

export const TableWidget = (props) => {
    const { widget } = props;

    const [currentPage, setCurrentPage] = useState(0);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    function renderContent(data) {
        const totalPages = Math.ceil(data.rows.length / MAX_ITEMS);
        const hasPagination = data.rows.length > MAX_ITEMS;

        function sortRows(rows) {
            if (!sortConfig.key) {
                return rows;
            }

            const colIndex = data.cols.findIndex((col) => {
                return col.id === sortConfig.key;
            });

            const colType = data.cols[colIndex]?.type;

            if (colIndex === -1 || !colType) {
                return rows;
            }

            // Use the sort utility for type-aware sorting
            return [...rows].sort((a, b) => {
                return sort([a[colIndex], b[colIndex]], colType, sortConfig.direction);
            });
        }

        function getPaginatedRows() {
            const sortedRows = sortRows(data.rows);
            const start = currentPage * MAX_ITEMS;
            const end = start + MAX_ITEMS;

            return sortedRows.slice(start, end);
        }

        function handleSort(colId) {
            setSortConfig((prev) => {
                if (prev.key === colId) {
                    // Toggle direction
                    return {
                        key: colId,
                        direction: prev.direction === 'asc' ? 'desc' : 'asc',
                    };
                }

                // Set new column as sorted (default to ascending)
                return { key: colId, direction: 'asc' };
            });
        }

        function barWidth(rowValue, colIndex, allRows) {
            const maxVal = Math.max(...allRows.map((row) => {
                return row[colIndex];
            }));

            if (maxVal === 0) {
                return 0;
            }

            return (rowValue / maxVal) * 100;
        }

        function Bar({ row, colIndex, children }) {
            const width = barWidth(row[colIndex], colIndex, data.rows);

            return (
                <div className="mc-w-full mc-h-full mc-relative">
                    <div
                        className="mc-absolute mc-top-0 mc-left-0 mc-h-full mc-rounded mc-bg-green-50"
                        style={{ width: `${width}%` }}
                    ></div>

                    {children}
                </div>
            );
        }

        function renderRow(row) {
            return (
                <div key={row[0]} className="mc-flex mc-w-full">
                    {data.cols.map((col, index) => {
                        return (
                            <div
                                key={col.id}
                                className={
                                    index === 0
                                        ? 'mc-flex-grow mc-w-full mc-overflow-hidden'
                                        : 'mc-text-right mc-items-center mc-justify-end mc-flex mc-w-16 mc-min-w-16'
                                }
                            >
                                {index === 0 ? (
                                    <Bar row={row} colIndex={1}>
                                        <div className="mc-flex mc-justify-start mc-px-2 mc-py-1.5 mc-group mc-text-sm mc-relative mc-z-9 mc-break-all mc-w-full">
                                            <div className="mc-max-w-max mc-w-full mc-flex mc-items-center md:mc-overflow-hidden">
                                                <span className="mc-w-full md:mc-truncate">{row[index]}</span>
                                            </div>
                                        </div>
                                    </Bar>
                                ) : (
                                    <span className="mc-text-sm mc-text-right mc-w-full">
                                        {format(row[index], chartFormat(col, 'label'))}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        }

        return (
            <div className="mc-h-full mc-flex mc-flex-col">
                <div className="mc-my-2">
                    <div className="mc-pt-3 mc-w-full mc-font-medium mc-text-xs mc-tracking-wide mc-text-slate-400 mc-flex mc-items-center">
                        {data.cols.map((col, index) => {
                            return (
                                <span
                                    key={col.id}
                                    className={cn(
                                        index === 0 ? 'mc-flex-grow mc-truncate' : '',
                                    )}
                                    onClick={() => {
                                        return handleSort(col.id);
                                    }}
                                >
                                    <span className="mc-cursor-pointer">{col.label}</span>
                                </span>
                            );
                        })}
                    </div>
                </div>

                <div className="mc-flex-1 mc-h-full">
                    <div className="mc-flex-grow mc-flex mc-flex-col mc-gap-1 mc-overflow-hidden">
                        {getPaginatedRows().map(renderRow)}
                    </div>
                </div>

                {hasPagination && (
                    <div className="mc-flex mc-gap-2 mc-mx-auto">
                        <Button
                            variant="outline"
                            size="icon"
                            className="mc-px-3 mc-py-2"
                            disabled={currentPage === 0}
                            onClick={() => {
                                return setCurrentPage((prev) => {
                                    return Math.max(prev - 1, 0);
                                });
                            }}
                        >
                            <ChevronLeft />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            className="mc-px-3 mc-py-2"
                            disabled={currentPage >= totalPages - 1}
                            onClick={() => {
                                return setCurrentPage((prev) => {
                                    return Math.min(prev + 1, totalPages - 1);
                                });
                            }}
                        >
                            <ChevronRight />
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    return <WidgetLarge className="mc-h-[29rem]" renderContent={renderContent} {...props} />;
};

TableWidget.meta = {
    name: 'Table',
    icon: TbTableFilled,
};
