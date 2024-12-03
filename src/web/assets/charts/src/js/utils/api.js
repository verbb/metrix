import { useCallback } from 'react';

const counterWidgetData = [
    {
        metric: 'sessions',
        period: 'today',

        chart: {
            cols: [
                {
                    type: 'integer',
                    labelFormat: 'numberLong',
                },
                {
                    type: 'float',
                    labelFormat: 'percentageChange',
                    label: 'from yesterday',
                },
            ],
            rows: [
                [125, 44],
            ],
        },
    },
    {
        metric: 'sessions',
        period: 'week',

        chart: {
            cols: [
                {
                    type: 'integer',
                    labelFormat: 'numberLong',
                },
                {
                    type: 'float',
                    labelFormat: 'percentageChange',
                    label: 'from last week',
                },
            ],
            rows: [
                [346, 25],
            ],
        },
    },
    {
        metric: 'sessions',
        period: 'month',

        chart: {
            cols: [
                {
                    type: 'integer',
                    labelFormat: 'numberLong',
                },
                {
                    type: 'float',
                    labelFormat: 'percentageChange',
                    label: 'from last month',
                },
            ],
            rows: [
                [1239, 180],
            ],
        },
    },
    {
        metric: 'sessions',
        period: 'year',

        chart: {
            cols: [
                {
                    type: 'integer',
                    labelFormat: 'numberLong',
                },
                {
                    type: 'float',
                    labelFormat: 'percentageChange',
                    label: 'from last year',
                },
            ],
            rows: [
                [9611, 252],
            ],
        },
    },
];

const tableWidgetData = [
    {
        dimension: 'browsers',
        metric: 'sessions',
        period: 'today',

        chart: {
            cols: [
                {
                    type: 'string',
                    label: 'Browser',
                    id: 'browser',
                },
                {
                    type: 'integer',
                    labelFormat: 'numberShort',
                    label: 'Sessions',
                    id: 'sessions',
                },
            ],

            rows: [
                ['Chrome', 615],
                ['Safari', 51],
                ['Firefox', 13],
                ['Microsoft Edge', 86],
                ['Opera', 4],
                ['Samsung Browser', 9],
                ['(not set)', 3],
                ['Mobile App', 3],
                ['Yandex Browser', 2],
                ['Yandex2 Browser', 2],
            ],
        },
    },
    {
        dimension: 'browsers',
        metric: 'sessions',
        period: 'week',

        chart: {
            cols: [
                {
                    type: 'string',
                    label: 'Browser',
                    id: 'browser',
                },
                {
                    type: 'integer',
                    labelFormat: 'numberShort',
                    label: 'Sessions',
                    id: 'sessions',
                },
            ],

            rows: [
                ['Chrome', 2615],
                ['Safari', 951],
                ['Firefox', 413],
                ['Microsoft Edge', 186],
                ['Opera', 14],
                ['Samsung Browser', 9],
                ['(not set)', 3],
                ['Mobile App', 3],
                ['Yandex Browser', 2],
                ['Yandex2 Browser', 2],
            ],
        },
    },
    {
        dimension: 'browsers',
        metric: 'sessions',
        period: 'month',

        chart: {
            cols: [
                {
                    type: 'string',
                    label: 'Browser',
                    id: 'browser',
                },
                {
                    type: 'integer',
                    labelFormat: 'numberShort',
                    label: 'Sessions',
                    id: 'sessions',
                },
            ],

            rows: [
                ['Chrome', 8615],
                ['Safari', 951],
                ['Firefox', 413],
                ['Microsoft Edge', 186],
                ['Opera', 14],
                ['Samsung Browser', 9],
                ['(not set)', 3],
                ['Mobile App', 3],
                ['Yandex Browser', 2],
                ['Yandex2 Browser', 2],
            ],
        },
    },
    {
        dimension: 'browsers',
        metric: 'sessions',
        period: 'year',

        chart: {
            cols: [
                {
                    type: 'string',
                    label: 'Browser',
                    id: 'browser',
                },
                {
                    type: 'integer',
                    labelFormat: 'numberShort',
                    label: 'Sessions',
                    id: 'sessions',
                },
            ],

            rows: [
                ['Chrome', 32615],
                ['Safari', 951],
                ['Firefox', 413],
                ['Microsoft Edge', 186],
                ['Opera', 14],
                ['Samsung Browser', 9],
                ['(not set)', 3],
                ['Mobile App', 3],
                ['Yandex Browser', 2],
                ['Yandex2 Browser', 2],
            ],
        },
    },
];

const pieWidgetData = [
    {
        dimension: 'browsers',
        metric: 'sessions',
        period: 'today',
        chart: {
            cols: [
                { type: 'string', label: 'Browser', id: 'browser' },
                {
                    type: 'integer', labelFormat: 'numberShort', label: 'Sessions', id: 'sessions',
                },
            ],
            rows: [
                ['Chrome', 215],
                ['Safari', 120],
                ['Firefox', 40],
                ['Microsoft Edge', 30],
                ['Opera', 15],
                ['Samsung Browser', 9],
                ['(not set)', 3],
                ['Mobile App', 3],
                ['Yandex Browser', 2],
            ],
        },
    },
    {
        dimension: 'browsers',
        metric: 'sessions',
        period: 'week',
        chart: {
            cols: [
                { type: 'string', label: 'Browser', id: 'browser' },
                {
                    type: 'integer', labelFormat: 'numberShort', label: 'Sessions', id: 'sessions',
                },
            ],
            rows: [
                ['Chrome', 1420],
                ['Safari', 800],
                ['Firefox', 180],
                ['Microsoft Edge', 120],
                ['Opera', 45],
                ['Samsung Browser', 25],
                ['(not set)', 3],
                ['Mobile App', 3],
                ['Yandex Browser', 2],
            ],
        },
    },
    {
        dimension: 'browsers',
        metric: 'sessions',
        period: 'month',

        chart: {
            cols: [
                {
                    type: 'string',
                    label: 'Browser',
                    id: 'browser',
                },
                {
                    type: 'integer',
                    labelFormat: 'numberShort',
                    label: 'Sessions',
                    id: 'sessions',
                },
            ],

            rows: [
                ['Chrome', 615],
                ['Safari', 400],
                ['Firefox', 40],
                ['Microsoft', 20],
                ['Opera', 10],
                ['Samsung Browser', 9],
                ['(not set)', 3],
                ['Mobile App', 3],
                ['Yandex Browser', 2],
            ],
        },
    },
    {
        dimension: 'browsers',
        metric: 'sessions',
        period: 'year',
        chart: {
            cols: [
                { type: 'string', label: 'Browser', id: 'browser' },
                {
                    type: 'integer', labelFormat: 'numberShort', label: 'Sessions', id: 'sessions',
                },
            ],
            rows: [
                ['Chrome', 185600],
                ['Safari', 96500],
                ['Firefox', 21000],
                ['Microsoft Edge', 12000],
                ['Opera', 3500],
                ['Samsung Browser', 2800],
                ['(not set)', 30],
                ['Mobile App', 32],
                ['Yandex Browser', 27],
            ],
        },
    },
];

const barWidgetData = [
    {
        metric: 'sessions',
        period: 'today',
        chart: {
            cols: [
                {
                    type: 'date', labelFormat: 'datePeriodDayShort', tooltipFormat: 'datePeriodDayLong', label: 'Date', id: 'date',
                },
                {
                    type: 'integer', labelFormat: 'numberShort', tooltipFormat: 'numberLong', label: 'Sessions', id: 'sessions',
                },
            ],
            rows: [
                ['2024-11-13 00:00:00', 103],
                ['2024-11-14 01:00:00', 88],
                ['2024-11-15 02:00:00', 75],
                ['2024-11-16 03:00:00', 62],
                ['2024-11-17 04:00:00', 510],
                ['2024-11-18 05:00:00', 340],
                ['2024-11-19 06:00:00', 150],
            ],
        },
    },
    {
        metric: 'sessions',
        period: 'week',
        chart: {
            cols: [
                {
                    type: 'date', labelFormat: 'datePeriodWeekShort', tooltipFormat: 'datePeriodWeekLong', label: 'Date', id: 'date',
                },
                {
                    type: 'integer', labelFormat: 'numberShort', tooltipFormat: 'numberLong', label: 'Sessions', id: 'sessions',
                },
            ],
            rows: [
                ['2024-11-11 00:00:00', 623],
                ['2024-11-12 00:00:00', 712],
                ['2024-11-13 00:00:00', 890],
                ['2024-11-14 00:00:00', 950],
                ['2024-11-15 00:00:00', 1020],
                ['2024-11-16 00:00:00', 1150],
                ['2024-11-17 00:00:00', 1300],
            ],
        },
    },
    {
        metric: 'sessions',
        period: 'month',

        chart: {
            cols: [
                {
                    type: 'date',
                    labelFormat: 'datePeriodMonthShort',
                    tooltipFormat: 'datePeriodMonthLong',
                    label: 'Date',
                    id: 'date',
                },
                {
                    type: 'integer',
                    labelFormat: 'numberShort',
                    tooltipFormat: 'numberLong',
                    label: 'Sessions',
                    id: 'sessions',
                },
            ],

            rows: [
                ['2024-11-01 00:00:00', 1041],
                ['2024-11-02 00:00:00', 1186],
                ['2024-11-03 00:00:00', 1317],
                ['2024-11-04 00:00:00', 1409],
                ['2024-11-05 00:00:00', 1468],
                ['2024-11-06 00:00:00', 1357],
                ['2024-11-07 00:00:00', 1214],
                ['2024-11-08 00:00:00', 1139],
                ['2024-11-09 00:00:00', 1230],
                ['2024-11-10 00:00:00', 1245],
                ['2024-11-11 00:00:00', 1263],
                ['2024-11-12 00:00:00', 930],
                ['2024-11-13 00:00:00', 632],
                ['2024-11-14 00:00:00', 450],
                ['2024-11-15 00:00:00', 385],
                ['2024-11-16 00:00:00', 383],
                ['2024-11-17 00:00:00', 397],
                ['2024-11-18 00:00:00', 413],
                ['2024-11-19 00:00:00', 455],
                ['2024-11-20 00:00:00', 635],
                ['2024-11-21 00:00:00', 823],
                ['2024-11-22 00:00:00', 986],
                ['2024-11-23 00:00:00', 1026],
                ['2024-11-24 00:00:00', 1089],
            ],
        },
    },
    {
        metric: 'sessions',
        period: 'year',
        chart: {
            cols: [
                {
                    type: 'date', labelFormat: 'datePeriodYearShort', tooltipFormat: 'datePeriodYearLong', label: 'Date', id: 'date',
                },
                {
                    type: 'integer', labelFormat: 'numberShort', tooltipFormat: 'numberLong', label: 'Sessions', id: 'sessions',
                },
            ],
            rows: [
                ['2024-01-01 00:00:00', 6123],
                ['2024-02-01 00:00:00', 6987],
                ['2024-03-01 00:00:00', 7321],
                ['2024-04-01 00:00:00', 6800],
                ['2024-05-01 00:00:00', 7102],
                ['2024-06-01 00:00:00', 7400],
                ['2024-07-01 00:00:00', 7600],
                ['2024-08-01 00:00:00', 8000],
                ['2024-09-01 00:00:00', 8500],
                ['2024-10-01 00:00:00', 8700],
                ['2024-11-01 00:00:00', 9000],
            ],
        },
    },
];

const lineWidgetData = [
    {
        metric: 'sessions',
        period: 'today',
        chart: {
            cols: [
                {
                    type: 'date', labelFormat: 'datePeriodDayShort', tooltipFormat: 'datePeriodDayLong', label: 'Date', id: 'date',
                },
                {
                    type: 'integer', labelFormat: 'numberShort', tooltipFormat: 'numberLong', label: 'Sessions', id: 'sessions',
                },
            ],
            rows: [
                ['2024-11-19 00:00:00', 12],
                ['2024-11-19 01:00:00', 15],
                ['2024-11-19 02:00:00', 8],
                ['2024-11-19 03:00:00', 10],
                ['2024-11-19 04:00:00', 5],
                ['2024-11-19 05:00:00', 7],
                ['2024-11-19 06:00:00', 12],
            ],
        },
    },

    {
        metric: 'sessions',
        period: 'week',
        chart: {
            cols: [
                {
                    type: 'date', labelFormat: 'datePeriodWeekShort', tooltipFormat: 'datePeriodWeekLong', label: 'Date', id: 'date',
                },
                {
                    type: 'integer', labelFormat: 'numberShort', tooltipFormat: 'numberLong', label: 'Sessions', id: 'sessions',
                },
            ],
            rows: [
                ['2024-11-11 00:00:00', 623],
                ['2024-11-12 00:00:00', 712],
                ['2024-11-13 00:00:00', 890],
                ['2024-11-14 00:00:00', 950],
                ['2024-11-15 00:00:00', 1020],
                ['2024-11-16 00:00:00', 1150],
                ['2024-11-17 00:00:00', 1300],
            ],
        },
    },

    {
        metric: 'sessions',
        period: 'month',

        chart: {
            cols: [
                {
                    type: 'date',
                    labelFormat: 'datePeriodMonthShort',
                    tooltipFormat: 'datePeriodMonthLong',
                    label: 'Date',
                    id: 'date',
                },
                {
                    type: 'integer',
                    labelFormat: 'numberShort',
                    tooltipFormat: 'numberLong',
                    label: 'Sessions',
                    id: 'sessions',
                },
            ],

            rows: [
                ['2024-11-01 00:00:00', 1041],
                ['2024-11-02 00:00:00', 1186],
                ['2024-11-03 00:00:00', 1317],
                ['2024-11-04 00:00:00', 1409],
                ['2024-11-05 00:00:00', 1468],
                ['2024-11-06 00:00:00', 1357],
                ['2024-11-07 00:00:00', 1214],
                ['2024-11-08 00:00:00', 1139],
                ['2024-11-09 00:00:00', 1230],
                ['2024-11-10 00:00:00', 1245],
                ['2024-11-11 00:00:00', 1263],
                ['2024-11-12 00:00:00', 930],
                ['2024-11-13 00:00:00', 632],
                ['2024-11-14 00:00:00', 450],
                ['2024-11-15 00:00:00', 385],
                ['2024-11-16 00:00:00', 383],
                ['2024-11-17 00:00:00', 397],
                ['2024-11-18 00:00:00', 413],
                ['2024-11-19 00:00:00', 455],
                ['2024-11-20 00:00:00', 635],
                ['2024-11-21 00:00:00', 823],
                ['2024-11-22 00:00:00', 986],
                ['2024-11-23 00:00:00', 1026],
                ['2024-11-24 00:00:00', 1089],
            ],
        },
    },

    {
        metric: 'sessions',
        period: 'year',

        chart: {
            cols: [
                {
                    type: 'date',
                    labelFormat: 'datePeriodYearShort',
                    tooltipFormat: 'datePeriodYearLong',
                    label: 'Date',
                    id: 'date',
                },
                {
                    type: 'integer',
                    labelFormat: 'numberShort',
                    tooltipFormat: 'numberLong',
                    label: 'Sessions',
                    id: 'sessions',
                },
            ],

            rows: [
                ['2024-01-01 00:00:00', 6123],
                ['2024-02-01 00:00:00', 6987],
                ['2024-03-01 00:00:00', 7321],
                ['2024-04-01 00:00:00', 6800],
                ['2024-05-01 00:00:00', 7102],
                ['2024-06-01 00:00:00', 7400],
                ['2024-07-01 00:00:00', 7600],
                ['2024-08-01 00:00:00', 8000],
                ['2024-09-01 00:00:00', 8500],
                ['2024-10-01 00:00:00', 8700],
                ['2024-11-01 00:00:00', 9000],
            ],
        },
    },
];

const browserWidgetData = [
    {
        dimension: 'browsers',
        metric: 'sessions',
        period: 'month',

        chart: {
            cols: [
                {
                    type: 'string',
                    label: 'Browser',
                    id: 'browser',
                },
                {
                    type: 'integer',
                    labelFormat: 'numberShort',
                    label: 'Sessions',
                    id: 'sessions',
                },
            ],

            rows: [
                ['Chrome', 615],
                ['Safari', 51],
                ['Firefox', 13],
                ['Microsoft Edge', 86],
                ['Opera', 4],
                ['Samsung Browser', 9],
                ['(not set)', 3],
                ['Mobile App', 3],
                ['Yandex Browser', 2],
                ['Yandex2 Browser', 2],
            ],
        },
    },
];

const osWidgetData = [
    {
        dimension: 'Operating System',
        metric: 'sessions',
        period: 'month',

        chart: {
            cols: [
                {
                    type: 'string',
                    label: 'Browser',
                    id: 'browser',
                },
                {
                    type: 'integer',
                    labelFormat: 'numberShort',
                    label: 'Sessions',
                    id: 'sessions',
                },
            ],

            rows: [
                ['Chrome', 615],
                ['Safari', 51],
                ['Firefox', 13],
                ['Microsoft Edge', 86],
                ['Opera', 4],
                ['Samsung Browser', 9],
                ['(not set)', 3],
                ['Mobile App', 3],
                ['Yandex Browser', 2],
                ['Yandex2 Browser', 2],
            ],
        },
    },
];

const screenSizeWidgetData = [
    {
        dimension: 'Screen Size',
        metric: 'sessions',
        period: 'month',

        chart: {
            cols: [
                {
                    type: 'string',
                    label: 'Browser',
                    id: 'browser',
                },
                {
                    type: 'integer',
                    labelFormat: 'numberShort',
                    label: 'Sessions',
                    id: 'sessions',
                },
            ],

            rows: [
                ['Chrome', 615],
                ['Safari', 51],
                ['Firefox', 13],
                ['Microsoft Edge', 86],
                ['Opera', 4],
                ['Samsung Browser', 9],
                ['(not set)', 3],
                ['Mobile App', 3],
                ['Yandex Browser', 2],
                ['Yandex2 Browser', 2],
            ],
        },
    },
];

import widgetData from '@/js/widget-data';

export const api = {
    get(url, params = {}) {
        let data = {};

        if (url === 'widgets') {
            const viewData = widgetData.find((v) => { return v.view === params.view; });

            data = viewData.widgets;

            // return new Promise((resolve, reject) => {
            //     setTimeout(() => {
            //         reject(new Error('Simulated API error'));
            //         resolve(data);
            //     }, 1000);
            // });
        }

        if (url === 'dimensions-data') {
            if (params.source === 'Plausible') {
                data = [
                    { value: 'browsers', label: 'Plausible Browsers' },
                    { value: 'devices', label: 'Plausible Devices' },
                    { value: 'os', label: 'Plausible Operating Systems' },
                ];
            } else {
                data = [
                    { value: 'browsers', label: 'Browsers' },
                    { value: 'devices', label: 'Devices' },
                    { value: 'os', label: 'Operating Systems' },
                ];
            }
        }


        if (url === 'metrics-data') {
            if (params.source === 'Plausible') {
                data = [
                    { value: 'sessions', label: 'Plausible Sessions' },
                    { value: 'users', label: 'Plausible Users' },
                    { value: 'pageViews', label: 'Plausible Page Views' },
                ];
            } else {
                data = [
                    { value: 'sessions', label: 'Sessions' },
                    { value: 'users', label: 'Users' },
                    { value: 'pageViews', label: 'Page Views' },
                ];
            }
        }

        if (params.data === 'counter-widget-data') {
            // return new Promise((resolve, reject) => {
            //     setTimeout(() => {
            //         reject(new Error('Simulated API error'));
            //         resolve(data);
            //     }, 1000);
            // });

            data = counterWidgetData.find((d) => {
                return d.period === params.period;
            });
        }

        if (params.data === 'table-widget-data') {
            data = tableWidgetData.find((d) => {
                return d.period === params.period;
            });
        }

        if (params.data === 'pie-widget-data') {
            data = pieWidgetData.find((d) => {
                return d.period === params.period;
            });
        }

        if (params.data === 'bar-widget-data') {
            data = barWidgetData.find((d) => {
                return d.period === params.period;
            });
        }

        if (params.data === 'line-widget-data') {
            data = lineWidgetData.find((d) => {
                return d.period === params.period;
            });
        }

        if (params.data === 'browser-data') {
            data = browserWidgetData.find((d) => {
                return d.period === params.period;
            });
        }

        if (params.data === 'os-data') {
            data = osWidgetData.find((d) => {
                return d.period === params.period;
            });
        }

        if (params.data === 'screen-size-data') {
            data = screenSizeWidgetData.find((d) => {
                return d.period === params.period;
            });
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // reject(new Error('Simulated API error'));
                resolve(data);
            }, 1000);
        });
    },
};
