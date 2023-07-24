export const createBarChart = function(data) {
    // set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 60 }
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select(".chart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Life expectancy at birth, total (years) for all BRICS countries from 2000 to 2020
const xValues = data.filter((value) => {
    value === "SP.DYN.LE00.IN"
});

// Population, total of all BRICS countries from 2000 to 2020
const yValues = data.filter((value) => {
    value === "SP.POP.TOTL"
});

// Add X axis
const x = d3.scaleLinear()
            .domain(xValues)
            .range([ 0, width ]);
svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

// Add Y axis
const y = d3.scaleLinear()
            .domain(yValues)
            .range([ height, 0]);
svg.append("g")
            .call(d3.axisLeft(y));

// Add dots
svg.append('g')
            .selectAll("dot")
            .data(data)
            .join("circle")
                .attr("cx", function (d) { return x(xValues); } )
                .attr("cy", function (d) { return y(yValues); } )
                .attr("r", 1.5)
                .style("fill", "#69b3a2")

}