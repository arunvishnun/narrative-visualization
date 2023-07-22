
(async function() {
    // const data =  await d3.json("../data/full-data.json");
    const data =  await d3.csv("../data/gdp-growth-data.csv");
    
    if (data) {
        // Remove loading indicator once data is available.
        d3.select('.loading-indicator').remove()

        console.log(data);
    }
})();