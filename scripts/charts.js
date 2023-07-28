import { filter } from './utils.js';

export const createCharts = (data) => {

  let selectedCountry = null;
  let selectedYear = null;
  let currentState = "scatterplot";
  let previousState = null;

  const dataArray = filter(data);

  // Define color scale
  const colorScale = d3.scaleOrdinal()
    .domain(dataArray.map(d => d.country))
    .range(d3.schemeCategory10);

  const formatGDP = d3.format(".2s");

  // init the flow
  showScatterPlot();

  function showScatterPlot() {
    d3.select("#scatter-plot-container").classed("hidden", false);
    d3.select("#line-chart-container").classed("hidden", true);
    d3.select("#bar-chart-container").classed("hidden", true);
    d3.select("#back-button").classed("hidden", true);
    currentState = "scatterplot";
    selectedCountry = null; // Reset selectedCountry when showing the scatter plot
    selectedYear = null; // Reset selectedYear when showing the scatter plot

    createScatterPlot();
  }

  function createScatterPlot() {

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
      .on("click", showLineChart);

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

  // Function to handle dot click event and show the line chart
  function showLineChart(event, d) {
    previousState = currentState;
    currentState = "linechart";

    // Hide the scatter plot and show the line chart
    d3.select("#scatter-plot-container").classed("hidden", true);
    d3.select("#line-chart-container").classed("hidden", false);
    d3.select("#bar-chart-container").classed("hidden", true);
    d3.select("#back-button").classed("hidden", false);
    currentState = "linechart";

    // Store the selected country and year
    if (d) {
      selectedCountry = d.country;
      selectedYear = d.year;
    }

    // Create and update the line chart for the selected country
    createLineChart(data, selectedCountry);

    // Show the back button for the line chart
    d3.select("#back-button").classed("hidden", false);
  }

  // Function to create and update the line chart
  function createLineChart(data, selectedCountry) {
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
    const gdpGrowthData = selectedCountryData.map(d => ({ year: +d.year, gdpGrowth: +d.gdpGrowth, gdpCurrentUsDollar: +d.gdpCurrentUsDollar }));

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

  function showBarChart(selectedCountry, d) {
    // Set the previous state to the current state before updating it
    previousState = currentState;
    currentState = "barchart";

    d3.select("#scatter-plot-container").classed("hidden", true);
    d3.select("#line-chart-container").classed("hidden", true);
    d3.select("#bar-chart-container").classed("hidden", false);
    d3.select("#back-button").classed("hidden", false);

    // Call the createBarChart function on click to show the bar chart
    createBarChart(selectedCountry, d.year);

    // Show the back button for the bar chart
    d3.select("#back-button").classed("hidden", false);
  }

  // Function to create and update the bar chart
  function createBarChart(country, year) {
    // Filter data for the selected country and year
    const selectedCountryData = data.filter(d => d.country === country && d.year == year)[0];
    const expenditures = [
      { label: "Education Expenditure", value: selectedCountryData.educationExpenditure },
      { label: "Military Expenditure", value: selectedCountryData.militaryExpenditure },
      { label: "Research and Development Expenditure", value: selectedCountryData.researchAndDevelopmentExpenditure },
      { label: "Health Expenditure", value: selectedCountryData.healthExpenditure },
      { label: "Total Expense", value: selectedCountryData.totalExpense }
    ];

    // Set up the bar chart container
    const barSvg = d3.select("#bar-chart")
      .attr("width", 500)
      .attr("height", 500);

    // Set up margins and dimensions for the bar chart
    const margin = { top: 100, right: 80, bottom: 100, left: 100 };
    const barWidth = 600 - margin.left - margin.right;
    const barHeight = 500 - margin.top - margin.bottom;

    // Create scales for the bar chart
    const xBarScale = d3.scaleBand()
      .domain(expenditures.map(d => d.label))
      .range([0, barWidth])
      .padding(0.3);

    const yBarScale = d3.scaleLinear()
      .domain([0, d3.max(expenditures, d => d.value)])
      .range([barHeight, 0]);

    // Create axes for the bar chart
    const xAxis = d3.axisBottom(xBarScale);
    const yAxis = d3.axisLeft(yBarScale).ticks(5);

    // Append the bars to the bar chart
    const bars = barSvg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .selectAll(".bar")
      .data(expenditures)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xBarScale(d.label))
      .attr("y", d => yBarScale(d.value))
      .attr("width", xBarScale.bandwidth())
      .attr("height", d => barHeight - yBarScale(d.value))
      .attr("fill", colorScale(country));

    // Add x-axis to the bar chart
    barSvg.append("g")
      .attr("transform", `translate(${margin.left}, ${barHeight + margin.top})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.15em")
      .attr("transform", "rotate(-45)");

    // Add y-axis to the bar chart
    barSvg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(yAxis);

    const barChartTooltip = d3.select("#bar-chart-tooltip");
    // Add tooltip to the bars
    bars.on("mouseover", (event, d) => {
      barChartTooltip.style("visibility", "visible")
        .html(`${d.label}: ${d.value.toFixed(2)}%`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => {
      barChartTooltip.style("visibility", "hidden");
    });

    currentState = "barchart";
  }

  // Function to handle back button click
  function handleBackButtonClick() {

    if (previousState === "scatterplot") {
      // Show the scatter plot and hide the line chart and bar chart
      d3.select("#scatter-plot-container").classed("hidden", false);
      d3.select("#line-chart-container").classed("hidden", true);
      d3.select("#bar-chart-container").classed("hidden", true);
      d3.select("#back-button").classed("hidden", true);
      currentState = "scatterplot";
    } else if (previousState === "linechart") {
      // Show the line chart and hide the bar chart
      d3.select("#scatter-plot-container").classed("hidden", true);
      d3.select("#line-chart-container").classed("hidden", false);
      d3.select("#bar-chart-container").classed("hidden", true);
      d3.select("#back-button").classed("hidden", false);
      currentState = "linechart";
    } else if (previousState === "barchart") {
      // Show the bar chart and hide the line chart
      d3.select("#scatter-plot-container").classed("hidden", true);
      d3.select("#line-chart-container").classed("hidden", true);
      d3.select("#bar-chart-container").classed("hidden", false);
      d3.select("#back-button").classed("hidden", false);
      currentState = "barchart";
    }
    previousState = currentState;
  }

  // Add event listener to the back button
  const backButton = document.getElementById("back-button");
  backButton.addEventListener("click", handleBackButtonClick);
}