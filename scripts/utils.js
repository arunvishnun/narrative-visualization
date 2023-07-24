export const filter = (dataArray) => {
  const yearInput = document.getElementById("year");
  const selectedYear = yearInput.value;
  return dataArray.filter(d => {
    const filtered = (
      d.countryCode === "USA" || 
      d.countryCode === "CHN" ||
      d.countryCode === "IND" ||
      d.countryCode === "JPN" ||
      d.countryCode === "DEU" ||
      d.countryCode === "GBR" ||
      d.countryCode === "FRA" ||
      d.countryCode === "ITA" ||
      d.countryCode === "CAN" ||
      d.countryCode === "BRA") && d.year === selectedYear;
      
    return filtered;
  })
}

