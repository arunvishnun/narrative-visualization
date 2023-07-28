import { filter } from './utils.js';
import { createScatterPlot } from './scatterplot.js';
import { createLineChart } from './linechart.js';
import { createBarChart } from './barchart.js';

let selectedCountry = null;
let selectedYear = null;
let currentState = "scatterplot";
let previousState = null;

export const createCharts = (data) => {
  
  const dataArray = filter(data);

  // Define color scale
  const colorScale = d3.scaleOrdinal()
    .domain(dataArray.map(d => d.country))
    .range(d3.schemeCategory10);

  const formatGDP = d3.format(".2s");

  // init the flow
  showScatterPlot(dataArray, colorScale, formatGDP);

  function showScatterPlot() {
    d3.select("#scatter-plot-container").classed("hidden", false);
    d3.select("#line-chart-container").classed("hidden", true);
    d3.select("#bar-chart-container").classed("hidden", true);
    d3.select("#back-button").classed("hidden", true);
    currentState = "scatterplot";
    selectedCountry = null; // Reset selectedCountry when showing the scatter plot
    selectedYear = null; // Reset selectedYear when showing the scatter plot

    createScatterPlot(dataArray, colorScale, formatGDP);
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

export function showLineChart(event, d) {
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
  createLineChart(data, selectedCountry, colorScale, formatGDP);

  // Show the back button for the line chart
  d3.select("#back-button").classed("hidden", false);
}

export function showBarChart(selectedCountry, d) {
  // Set the previous state to the current state before updating it
  previousState = currentState;
  currentState = "barchart";

  d3.select("#scatter-plot-container").classed("hidden", true);
  d3.select("#line-chart-container").classed("hidden", true);
  d3.select("#bar-chart-container").classed("hidden", false);
  d3.select("#back-button").classed("hidden", false);

  // Call the createBarChart function on click to show the bar chart
  createBarChart(data, selectedCountry, d.year, colorScale, formatGDP);

  // Show the back button for the bar chart
  d3.select("#back-button").classed("hidden", false);
}
