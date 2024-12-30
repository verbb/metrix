export const WIDGET_HEIGHT = 14;
export const WIDGET_GAP = 1;

export const WIDGET_HEIGHTS = Array.from({ length: 5 }, (_, i) => {
    return {
        [`widget-${i + 1}`]: `${WIDGET_HEIGHT * (i + 1) + WIDGET_GAP * i}rem`,
    };
}).reduce((acc, cur) => { return { ...acc, ...cur }; }, {});

export const CHART_COLORS = [
    '#1C64F2', // Blue
    '#FF9800', // Vibrant orange
    '#16BDCA', // Teal
    '#E74694', // Pink
    '#9061F9', // Purple
    '#31C48D', // Green
    '#1A56DB', // Deep blue
    '#7E3AF2', // Medium purple
    '#F05252', // Red
    '#D4D4D8', // Light gray
    '#FFC107', // Golden yellow
    '#8BC34A', // Light green
    '#00ACC1', // Cyan
    '#FDD835', // Bright yellow
    '#E91E63', // Strong pink
    '#607D8B', // Blue gray
    '#4CAF50', // Medium green
    '#795548', // Brown
    '#03A9F4', // Sky blue
    '#2196F3', // Medium blue
    '#FF5722', // Deep orange
    '#673AB7', // Medium purple
    '#9C27B0', // Violet
    '#00BCD4', // Cyan
    '#F4511E', // Reddish orange
    '#3F51B5', // Indigo
    '#009688', // Teal
    '#8E24AA', // Dark magenta
    '#A8DADC', // Light teal
    '#457B9D', // Deep steel blue
    '#F4A261', // Warm orange
    '#2A9D8F', // Emerald green
    '#264653', // Dark slate
    '#FFB4A2', // Soft coral
    '#E63946', // Crimson red
    '#F6BD60', // Light gold
    '#6A0572', // Deep purple
    '#355070', // Blue-gray
    '#B56576', // Dusty pink
    '#EAAC8B', // Pale peach
];
