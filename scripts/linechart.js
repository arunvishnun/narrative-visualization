import { showBarChart } from "./app.js"
export function createLineChart(data, selectedCountry, colorScale, formatGDP) {
  // Clear any existing line chart
  d3.select("#line-chart").selectAll("*").remove();

  // Set up the line chart container and margins
  const lineMargin = { top: 20, right: 20, bottom: 50, left: 50 };
  const lineWidth = 800 - lineMargin.left - lineMargin.right;
  const lineHeight = 600 - lineMargin.top - lineMargin.bottom;

  const lineSvg = d3.select("#line-chart")
    .attr("width", lineWidth + lineMargin.left + lineMargin.right)
    .attr("height", lineHeight + lineMargin.top + lineMargin.bottom)
    .append("g")
    .attr("transform", `translate(${lineMargin.left},${lineMargin.top})`);

  // Extract the GDP growth data for the selected country
  const selectedCountryData = data.filter(d => d.country === selectedCountry);
  const gdpGrowthData = selectedCountryData.map(d => ({
    year: +d.year,
    gdpGrowth: +d.gdpGrowth,
    gdpCurrentUsDollar: +d.gdpCurrentUsDollar
  }));

  // Define x and y scales for the line chart
  const xLineScale = d3.scaleLinear()
    .domain(d3.extent(selectedCountryData, d => d.year))
    .range([0, lineWidth]);

  // Define y scale for the line chart (considering both positive and negative values)
  const yLineScale = d3.scaleLinear()
    .domain([d3.min(gdpGrowthData, d => d.gdpGrowth) - 2, d3.max(gdpGrowthData, d => d.gdpGrowth) + 2])
    .range([lineHeight, 0]);

  // Define the line function
  const line = d3.line()
    .x(d => xLineScale(d.year))
    .y(d => yLineScale(d.gdpGrowth));

  // Define the tooltip for the line chart
  const lineTooltip = d3.select("#line-chart-container")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Draw circles for each data point with tooltips
  lineSvg.selectAll(".data-circle")
    .data(gdpGrowthData)
    .enter()
    .append("circle")
    .attr("class", "data-circle")
    .attr("cx", d => xLineScale(d.year))
    .attr("cy", d => yLineScale(d.gdpGrowth))
    .attr("r", 5)
    .attr("fill", colorScale(selectedCountry))
    .on("mouseover", (event, d) => {
      lineTooltip.transition()
        .duration(50)
        .style("opacity", 0.9);
      lineTooltip.html(`Year: ${d.year}<br>GDP Growth: ${d.gdpGrowth}%<br>GDP: ${formatGDP(d.gdpCurrentUsDollar).replace("G", "B")}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => {
      lineTooltip.transition()
        .duration(500)
        .style("opacity", 0);
    })
    .on("click", (event, d) => {
      showBarChart(selectedCountry, d);
    });

  // Draw the line chart
  lineSvg.append("path")
    .datum(gdpGrowthData)
    .attr("fill", "none")
    .attr("stroke", colorScale(selectedCountry))
    .attr("stroke-width", 2)
    .attr("d", line);

  // Add x-axis at the 0 of y-axis
  lineSvg.append("g")
    .attr("transform", `translate(0,${yLineScale(0)})`)
    .call(d3.axisBottom(xLineScale).ticks(10).tickFormat(d3.format("d")));

  // Add y-axis
  lineSvg.append("g")
    .call(d3.axisLeft(yLineScale).ticks(10));

  // Add x-axis label
  lineSvg.append("text")
    .attr("x", lineWidth / 2)
    .attr("y", lineHeight + lineMargin.bottom - 10)
    .attr("fill", "#000")
    .attr("text-anchor", "middle")
    .text("Year");

  // Add y-axis label
  lineSvg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -lineHeight / 2)
    .attr("y", -lineMargin.left + 15)
    .attr("fill", "#000")
    .attr("text-anchor", "middle")
    .text("GDP Growth (%)");
}
