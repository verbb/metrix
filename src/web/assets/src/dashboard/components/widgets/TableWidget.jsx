import { useState, useCallback } from 'react';

import { WIDGET_ICONS } from '@icons/widgetIcons';

import { Button } from '@verbb/plugin-kit-react/components/Button';
import { Icon } from '@verbb/plugin-kit-react/components/Icon';

import { WidgetLarge } from '@dashboard/components/widgets/WidgetLarge';

import {
    api, cn, format, chartFormat, WIDGET_HEIGHT, sort, TABLE_ROW_BAR_COLOR,
} from '@utils';

const BASE_MAX_ITEMS = WIDGET_HEIGHT - 5;

export const TableWidget = (props) => {
    const { widget } = props;

    const [currentPage, setCurrentPage] = useState(0);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Extra header lines (subtitle) steal vertical room from rows + pagination.
    const maxItems = widget.data?.subtitle
        ? Math.max(1, BASE_MAX_ITEMS - 1)
        : BASE_MAX_ITEMS;

    function renderContent(data) {
        const totalPages = Math.ceil(data.rows.length / maxItems) || 1;
        const hasPagination = data.rows.length > maxItems;
        const safePage = Math.min(currentPage, totalPages - 1);

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
            const start = safePage * maxItems;
            const end = start + maxItems;

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
                <div key={row[0]} role="row" className="flex w-full">
                    {data.cols.map((col, index) => {
                        return (
                            <div
                                key={col.id}
                                role="cell"
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
                <div
                    role="table"
                    aria-label={widget.data?.displayTitle || widget.data?.metricLabel || Craft.t('metrix', 'Analytics report')}
                    className="flex flex-1 flex-col"
                >
                    <div role="rowgroup" className="my-2">
                        <div role="row" className="pt-3 w-full font-medium text-xs tracking-wide text-gray-550 flex items-center">
                            {data.cols.map((col, index) => (
                                <div
                                    key={col.id}
                                    role="columnheader"
                                    aria-sort={sortConfig.key === col.id ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                                    className={index === 0 ? 'flex-grow truncate' : 'text-right'}
                                >
                                    <button
                                        type="button"
                                        className={cn('cursor-pointer w-full', index === 0 ? 'text-left' : 'text-right')}
                                        onClick={() => handleSort(col.id)}
                                    >
                                        <span>{col.label}</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div role="rowgroup" className="flex-1 h-full">
                        <div className="flex-grow flex flex-col gap-1 overflow-hidden">
                            {getPaginatedRows().map(renderRow)}
                        </div>
                    </div>
                </div>

                {hasPagination && (
                    <div className="flex gap-2 mx-auto flex-shrink-0">
                        <Button
                            variant="outline"
                            aria-label={Craft.t('metrix', 'Previous page')}
                            disabled={safePage === 0}
                            onClick={() => setCurrentPage((prev) => Math.max(Math.min(prev, totalPages - 1) - 1, 0))}
                        >
                            <Icon icon="chevron-left" />
                        </Button>

                        <Button
                            variant="outline"
                            aria-label={Craft.t('metrix', 'Next page')}
                            disabled={safePage >= totalPages - 1}
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
