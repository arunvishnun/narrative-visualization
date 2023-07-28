
export function createBarChart(data, selectedCountry, year, colorScale, formatGDP) {
  // Filter data for the selected country and year
  const selectedCountryData = data.filter(d => d.country === selectedCountry && d.year == year)[0];
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
    .attr("fill", colorScale(selectedCountry));

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
}
