// Note: This file is not used in visualization.


// The available data was not ready for direct use to plot charts. So this program was written and used only once to do data cleaning/formatting. 

// The JSON created using this code is saved as data.json and is used for plotting SVGs
export const cleanData = (fullData) => {
  let dataArray = [];
  const dataArrayMap = new Map()

  fullData.forEach((data) => {
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "Series Name" && key !== "Series Code" && key !== "Time" && key !== "Time Code" && data["Time"] !== "") {
        const country = key.split(" [")[0];
        const countryCode = key.match(/\[(.*?)\]/)[1];
        const year = data["Time"];

        let countryData = {}
        if (!dataArrayMap.has(`${country}#${year}`)) {
          // If the country doesn't exist in dataArrayMap, create a new object for it
          dataArrayMap.set(`${country}#${year}`, { country, countryCode, year });
        }
    
        countryData = dataArrayMap.get(`${country}#${year}`);

        // Check the Series Code and set the corresponding attribute
        if (data["Series Code"] === "NY.GDP.MKTP.KD.ZG") {
          
          countryData.gdpGrowth = !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
          
        } 
        
        else if (data["Series Code"] === "SP.POP.TOTL") {
          countryData.population = !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
        } 
        
        else if (data["Series Code"] === "MS.MIL.XPND.GD.ZS") {
          countryData.militaryExpenditure = !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
        } 
        
        else if (data["Series Code"] === "SE.XPD.TOTL.GD.ZS") {
          countryData.educationExpenditure = !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
        } 
        
        else if (data["Series Code"] === "GB.XPD.RSDV.GD.ZS") {
          countryData.researchAndDevelopmentExpenditure = !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
        }
        
        else if (data["Series Code"] === "SH.XPD.CHEX.GD.ZS") {
          countryData.healthExpenditure = !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
        }

        else if (data["Series Code"] === "GC.XPN.TOTL.GD.ZS") {
          countryData.totalExpense = !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
        }

        else if (data["Series Code"] === "NE.CON.GOVT.ZS") {
          countryData.governmentFinalConsumption = !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
        }

        else if (data["Series Code"] === "NY.GDP.MKTP.CD") {
          countryData.gdpCurrentUsDollar = !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
        }

        else if (data["Series Code"] === "GB.XPD.RSDV.GD.ZS") {
          countryData.researchAndDevelopmentExpenditure = !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
        }

        else if (data["Series Code"] === "NE.CON.TOTL.ZS") {
          countryData.finalConsumptionExpenditure = !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
        }

        dataArrayMap.set(`${country}#${year}`, countryData);
      }
    });
  });

  // Convert Map values to an array of objects and sort countries alphabetically
  dataArray = Array.from(dataArrayMap.values()).sort((a, b) => {
    const countryA = a.country.toUpperCase();
    const countryB = b.country.toUpperCase(); 
    if (countryA < countryB) {
      return -1;
    }
    if (countryA > countryB) {
      return 1;
    }
  
    // names must be equal
    return 0;
  });

  return dataArray
}


// Used only once to format data
export async function extractFullDataAndFormat() {
  const csvURL = 'https://raw.githubusercontent.com/arunvishnun/narrative-visualization/main/data/gdp-and-expenditure-all-countries.csv';
  const data = await d3.csv(csvURL);
  console.log(cleanData(data));
  document.getElementById("printFullData").innerHTML = JSON.stringify(cleanData(data));
}

// Metadata info. These are values selected from WDI database. Indiacates the code for various values plotted.
// This is only for reference and is not used directly in visualization

/* 
 - Series Name: 'Government expenditure on education, total (% of GDP)', Series Code: 'SE.XPD.TOTL.GD.ZS',
 - Series Name: 'Military expenditure (% of GDP)', Series Code: 'MS.MIL.XPND.GD.ZS',
 - Series Name: 'Research and development expenditure (% of GDP)', Series Code: 'GB.XPD.RSDV.GD.ZS',
 - Series Name: 'Current health expenditure (% of GDP)', Series Code: 'SH.XPD.CHEX.GD.ZS', 
 - Series Name: 'Expense (% of GDP)', Series Code: 'GC.XPN.TOTL.GD.ZS',
 - Series Name: 'GDP growth (annual %)', Series Code: 'NY.GDP.MKTP.KD.ZG'
 - Series Name: 'General government final consumption expenditure (% of GDP)', Series Code: 'NE.CON.GOVT.ZS', 
 - Series Name: 'GDP (current US$)', Series Code: 'NY.GDP.MKTP.CD', 
 - Series Name: 'Final consumption expenditure (% of GDP)', Series Code: 'NE.CON.TOTL.ZS', 
 - Series Name: 'Population, total', Series Code: 'SP.POP.TOTL', 
*/
const constants = [
  "SE.XPD.TOTL.GD.ZS",
  "MS.MIL.XPND.GD.ZS",
  "GB.XPD.RSDV.GD.ZS",
  "SH.XPD.CHEX.GD.ZS",
  "GC.XPN.TOTL.GD.ZS",
  "NY.GDP.MKTP.KD.ZG",
  "NE.CON.GOVT.ZS",
  "NY.GDP.MKTP.CD",
  "NE.CON.TOTL.ZS",
  "SP.POP.TOTL"
]