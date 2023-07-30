import { createCharts } from './charts.js';
import { cleanData, extractFullDataAndFormat } from './data-conversion.js';

const RUN_DATA_CLEAN = false;

const URL = 'https://raw.githubusercontent.com/arunvishnun/narrative-visualization/main/data/full-data.json';
// const URL = '../data/full-data.json';

(async function () {
    // set RUN_DATA_CLEAN to true Only to run once during developemnt to play around with data as its a large data set.
    if (RUN_DATA_CLEAN === true) {
        extractFullDataAndFormat()
        return;
    }

    const data = await d3.json(URL);
    console.log(data);
    createCharts(data);
})();

