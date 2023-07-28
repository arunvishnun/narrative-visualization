import { showLineChart } from "./app.js"
export function createScatterPlot(dataArray, colorScale, formatGDP) {
  // Set up the SVG container and margins
  const margin = { top: 50, right: 80, bottom: 80, left: 80 };
  const width = 860 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  const svg = d3.select("#scatterplot")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Define scales for x-axis (Population) and y-axis (GDP)
  const yScale = d3.scaleLinear()
    .domain([-1 * d3.max(dataArray, d => d.gdpGrowth) - 2, d3.max(dataArray, d => d.gdpGrowth) + 2])
    .range([height, 0]);

  const xScale = d3.scaleLog()
    .domain([d3.min(dataArray, d => d.population) - 10000000, d3.max(dataArray, d => d.population) + 1000000000])
    .range([0, width]);

  // Create scatter plot
  let scatterPlot = svg.selectAll(".dot")
    .data(dataArray)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.population))
    .attr("cy", d => yScale(d.gdpGrowth))
    .attr("r", 8)
    .style("fill", (d, i) => getColorForCountry(d.country))
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip)
    .on("click", (event, d) => showLineChart(event, d));

  svg.append("g")
    .attr("transform", `translate(0, ${height / 2})`)
    .call(d3.axisBottom(xScale))
    .append("text")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("fill", "#000")
    .attr("text-anchor", "middle")
    .text("Population");

  // Add y-axis
  svg.append("g")
    .call(d3.axisLeft(yScale).tickFormat(d => formatGDP(d).replace("G", "B")))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", -height / 2)
    .attr("fill", "#000")
    .attr("text-anchor", "middle")
    .text("GDP (Gross Domestic Product) Growth %");

  // Function to show tooltip
  function showTooltip(event, d) {
    const tooltip = d3.select("#scatter-tooltip");
    tooltip.style("opacity", 0.9)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 25) + "px")
      .html(`<strong>${d.country}</strong><br>
      GDP growth: ${d.gdpGrowth} % <br>
      GDP: ${formatGDP(d.gdpCurrentUsDollar).replace("G", "B")}<br>
      Population: ${d3.format(".2s")(d.population)}`);
  }

  // Function to hide tooltip
  function hideTooltip() {
    d3.select("#scatter-tooltip").style("opacity", 0);
  }

  // Function to get a color for each country
  function getColorForCountry(country) {
    const colorMap = new Map();
    const uniqueCountries = Array.from(new Set(dataArray.map(d => d.country)));
    uniqueCountries.forEach((c, i) => colorMap.set(c, d3.schemeCategory10[i % 10]));
    return colorMap.get(country);
  }

  // Function to update the scatter plot based on the selected year
  function updateScatterPlot() {
    scatterPlot = svg.selectAll(".dot")
      .data(filter(data));

    scatterPlot.exit().remove();

    scatterPlot.enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 8)
      .merge(scatterPlot)
      .attr("cx", d => xScale(d.population))
      .attr("cy", d => yScale(d.gdpGrowth))
      .style("fill", (d, i) => getColorForCountry(d.country))
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
  function toggleCountry(event) {
    const country = event.target.textContent;
    const selectedDots = scatterPlot.filter(d => d.country === country);

    const currentDisplay = selectedDots.style("display");
    const newDisplay = currentDisplay === "none" ? "block" : "none";

    selectedDots.style("display", newDisplay);

    // Fade out the legend item when toggled off
    const legendItem = d3.select(event.target.parentNode);
    legendItem.classed("legend-item-hidden", newDisplay === "none");
  }

  // Add event listener to update the scatter plot when the year input changes
  const yearInput = document.getElementById("year");
  yearInput.addEventListener("change", () => {
    updateScatterPlot();
  });

  updateLegend();
}
