import { useState, useCallback } from 'react';

import { WIDGET_ICONS } from '@icons/widgetIcons';

import { Button, Icon } from '@verbb/plugin-kit-react/components';

import { WidgetLarge } from '@dashboard/components/widgets/WidgetLarge';

import {
    api, cn, format, chartFormat, WIDGET_HEIGHT, sort, TABLE_ROW_BAR_COLOR,
} from '@utils';

const MAX_ITEMS = WIDGET_HEIGHT - 5;

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
                <div className="w-full h-full relative">
                    <div
                        className="absolute top-0 left-0 h-full rounded metrix-table-row-bar"
                        style={{ width: `${width}%`, backgroundColor: TABLE_ROW_BAR_COLOR }}
                    ></div>

                    {children}
                </div>
            );
        }

        function renderRow(row) {
            return (
                <div key={row[0]} className="flex w-full">
                    {data.cols.map((col, index) => {
                        return (
                            <div
                                key={col.id}
                                className={
                                    index === 0
                                        ? 'flex-grow w-full overflow-hidden'
                                        : 'text-right items-center justify-end flex w-16 min-w-16'
                                }
                            >
                                {index === 0 ? (
                                    <Bar row={row} colIndex={1}>
                                        <div className="flex justify-start px-2 py-1.5 group text-sm relative z-[1] break-all w-full">
                                            <div className="max-w-max w-full flex items-center md:overflow-hidden">
                                                <span className="w-full md:truncate">{row[index]}</span>
                                            </div>
                                        </div>
                                    </Bar>
                                ) : (
                                    <span className="text-sm text-right w-full">
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
            <div className="h-full flex flex-col">
                <div className="my-2">
                    <div className="pt-3 w-full font-medium text-xs tracking-wide text-gray-550 flex items-center">
                        {data.cols.map((col, index) => {
                            return (
                                <span
                                    key={col.id}
                                    className={cn(
                                        index === 0 ? 'flex-grow truncate' : '',
                                    )}
                                    onClick={() => {
                                        return handleSort(col.id);
                                    }}
                                >
                                    <span className="cursor-pointer">{col.label}</span>
                                </span>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-1 h-full">
                    <div className="flex-grow flex flex-col gap-1 overflow-hidden">
                        {getPaginatedRows().map(renderRow)}
                    </div>
                </div>

                {hasPagination && (
                    <div className="flex gap-2 mx-auto">
                        <Button
                            variant="outline"
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                        >
                            <Icon icon="chevron-left" />
                        </Button>

                        <Button
                            variant="outline"
                            disabled={currentPage >= totalPages - 1}
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                        >
                            <Icon icon="chevron-right" />
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    return <WidgetLarge className="h-widget-2" renderContent={renderContent} {...props} />;
};

TableWidget.meta = {
    name: 'Table',
    icon: WIDGET_ICONS.table,
};
