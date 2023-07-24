import { filter } from './utils.js';

export const createScatterPlot = (data) => {

  const dataArray = filter(data);

  // Set up the SVG container and margins
  const margin = { top: 50, right: 50, bottom: 80, left: 80 };
  const width = 800 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  const svg = d3.select("#scatterplot")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Define scales for x-axis (GDP) and y-axis (Population)
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(dataArray, d => d.gdpGrowth)])
    .range([0, width]);

  const yScale = d3.scaleLog()
    // .domain([d3.min(dataArray, d => d.population) - 10000000, d3.max(dataArray, d => d.population) + 1000000000])
    .domain([d3.min(dataArray, d => d.population), d3.max(dataArray, d => d.population)])
    .range([height, 0]);

  // Create scatter plot
  let scatterPlot = svg.selectAll(".dot")
    .data(dataArray)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.gdpGrowth))
    .attr("cy", d => yScale(d.population))
    .attr("r", 5) // Adjust the radius as needed
    .style("fill", (d, i) => d3.schemeCategory10[i % 10])
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip);;

  // Add x-axis with formatted GDP values
  const formatGDP = d3.format(".2s");

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).tickFormat(d => formatGDP(d).replace("G", "B")))
    .append("text")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("fill", "#000")
    .attr("text-anchor", "middle")
    .text("GDP (Gross Domestic Product) Growth %");

  // Add y-axis
  svg.append("g")
    .call(d3.axisLeft(yScale))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", -height / 2)
    .attr("fill", "#000")
    .attr("text-anchor", "middle")
    .text("Population");

  // Function to show tooltip
  function showTooltip(event, d) {
    const tooltip = d3.select(".tooltip");
    tooltip.style("opacity", 1)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 25) + "px")
      .html(`<strong>${d.country}</strong><br>GDP: ${formatGDP(d.gdpCurrentUsDollar).replace("G", "B")}<br>Population: ${formatGDP(d.population).replace("G", "B")}`);
  }

  // Function to hide tooltip
  function hideTooltip() {
    d3.select(".tooltip").style("opacity", 0);
  }

  // Function to update the scatter plot based on the selected year
  function updateScatterPlot() {

    scatterPlot = svg.selectAll(".dot")
        .data(filter(data));

    scatterPlot.exit().remove();

    scatterPlot.enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 5)
        .merge(scatterPlot)
        .attr("cx", d => xScale(d.gdpGrowth))
        .attr("cy", d => yScale(d.population))
        .style("fill", (d, i) => d3.schemeCategory10[i % 10])
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip);

    updateLegend();
  }

  // Function to update the legend based on unique countries
  function updateLegend() {
    const uniqueCountries = Array.from(new Set(dataArray.map(d => d.country)));

    const legend = d3.select("#legend")
      .selectAll(".legend-item")
      .data(uniqueCountries);

    const legendItems = legend.enter()
      .append("div")
      .attr("class", "legend-item")
      .style("cursor", "pointer")
      .on("click", toggleCountry);

    legendItems.append("div")
      .attr("class", "legend-color")
      .style("background-color", (d, i) => d3.schemeCategory10[i % 10]);

    legendItems.append("div")
      .text(d => d);

    legend.exit().remove();
  }

  // Function to toggle visibility of a country in the scatter plot
  function toggleCountry(country) {
    const selectedDots = scatterPlot.filter(d => d.country === country);

    selectedDots.style("display", function () {
      return d3.select(this).style("display") === "none" ? "block" : "none";
    });
  }

  // Add event listener to update the scatter plot when the year input changes
  const yearInput = document.getElementById("year");
  yearInput.addEventListener("change", () => {
      updateScatterPlot();
  });
}

