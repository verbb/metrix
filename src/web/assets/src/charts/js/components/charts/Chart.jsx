import {
    Chart as ChartJS,

    // General
    Legend,
    Tooltip,

    // Pie/Doughnut
    ArcElement,

    // Line/Area
    CategoryScale,
    LinearScale,
    LineElement,
    Filler,
    PointElement,

    // Bar
    BarElement,

} from 'chart.js';

// Register any plugins for Chart.js
ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
);

Tooltip.positioners.cursor = function(chartElements, coordinates) {
    return coordinates;
};

// Export only the chart types we need
export {
    Bar,
    Doughnut,
    Line,
} from 'react-chartjs-2';
