import { createCharts } from './charts.js';

// const URL = 'https://raw.githubusercontent.com/arunvishnun/narrative-visualization/main/data/gdp-growth-data.csv';
const URL = '../data/data.json';

(async function () {
    const data = await d3.json(URL);
    createCharts(data);
})();
