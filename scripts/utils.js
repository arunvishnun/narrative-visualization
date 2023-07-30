const onlyTop10Countries = false;
export const filter = (dataArray) => {
  const yearInput = document.getElementById("year");
  const selectedYear = yearInput.value;
  
  return dataArray.filter(d => {
    let filtered = d.year === selectedYear
    
    if (onlyTop10Countries) {
      filtered = filtered && (
        d.countryCode === "USA" || 
        d.countryCode === "CHN" ||
        d.countryCode === "IND" ||
        d.countryCode === "JPN" ||
        d.countryCode === "DEU" ||
        d.countryCode === "GBR" ||
        d.countryCode === "FRA" ||
        d.countryCode === "ITA" ||
        d.countryCode === "CAN" ||
        d.countryCode === "BRA");
    } 

    return filtered;
  }).filter(d => {
    // Show countries only with data values for better representation
    return d.gdpCurrentUsDollar && 
      d.researchAndDevelopmentExpenditure && 
      d.educationExpenditure && 
      d.militaryExpenditure && 
      d.healthExpenditure && 
      d.totalExpense;
  });
}

// // Find outliers using the Tukey method
// export function findOutliers(dataArray) {
//   const values = dataArray.map(d => d.gdpGrowth);
//   const q1 = d3.quantile(values.sort(d3.ascending), 0.55);
//   const q3 = d3.quantile(values.sort(d3.ascending), 0.55);
//   const iqr = q3 - q1;
//   const lowerBound = q1 - 1.5 * iqr;
//   const upperBound = q3 + 1.5 * iqr;

//   return dataArray.filter(d => d.gdpGrowth < lowerBound || d.gdpGrowth > upperBound);
// }

// // Find outliers using the Tukey method
// export function topEconomy(dataArray) {
//   const values = dataArray.sort((a, b) => {
    
//     if (a.gdpCurrentUsDollar > b.gdpCurrentUsDollar) {
//       return -1;
//     }
//     if (a.gdpCurrentUsDollar < b.gdpCurrentUsDollar) {
//       return 1;
//     }
//     // a must be equal to b
//     return 0;
//   })
    
//   return values;
// }

