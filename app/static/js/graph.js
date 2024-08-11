// globals
//const currentYear = new Date().getFullYear();
const currentYear = 2016
let chartData;

function init() {
  fetch("/api/v1/data")
    .then((response) => response.json())
    .then((data) => {
      // check data is loading correctly 
      console.log(data);
      // save data as a global variable for data
      chartData = data;
      // determine last 150 years for line graph
      const startYear = currentYear - 60;
      // set input bounds
      setInputBounds(startYear, currentYear);
      const {min, max} = getFirstAndLastYear(data);
      console.log({min, max})
      setInputYear(min, max);
      buildLineGraph(data, startYear, currentYear);
      //buildBarChart(data);
    })
    .catch((error) => console.error(error));
}

init();

//
function getFirstAndLastYear(data) {
  return data.reduce((accumulator, landing) => {
    const year = landing.year;
    const max = accumulator.max;
    const min = accumulator.min;
    if (min === undefined || year < min) {
      return { min: year, max };
    }
    if (max === undefined || year > max) {
      return { min, max: year };
    }
    return { min, max };
  }, {});
}

// function for slider bar
function setInputBounds(min, max) {
  const input = document.querySelector("#year-select");
  input.max = max;
  input.min = 1956;
  input.value = min;
  // start with disabled as data can't be reached until page loads
  input.removeAttribute("disabled");
  setInputLabel(min);
}

// function for label for slider bar
function setInputLabel(year) {
  const label = document.querySelector("#starting-label");
  label.innerHTML = `Starting Year: ${year}`;
}

// function for event listener for slider bar
function handleSliderChange(event) {
  const { target } = event;
  const { value } = target;
  // set label
  setInputLabel(value);
  // build the chart again based on selectors
  buildLineGraph(chartData, value, currentYear);
}

// build line graph
function buildLineGraph(data, startYear, currentYear) {
  // Filter data to include only the last 50 years
  const filteredData = data.filter((landing) => {
    return landing.year >= startYear && landing.year <= currentYear;
  });

  // Separate the data by hemisphere
  const northData = filteredData.filter((landing) => landing.lat >= 0);
  const southData = filteredData.filter((landing) => landing.lat < 0);

  // Get the years from the filtered data
  const years = filteredData.map((landing) => {
    return landing.year;
  });
  console.log("years", years);

  // Get unique years and sort them
  const uniqueYears = [...new Set(years)].sort((a, b) => a - b);
  console.log("unique years", uniqueYears);

  // Get counts for Northern Hemisphere
  const northCounts = uniqueYears.map((year) => {
    return northData.filter((landing) => landing.year === year).length;
  });

  // Get counts for Southern Hemisphere
  const southCounts = uniqueYears.map((year) => {
    return southData.filter((landing) => landing.year === year).length;
  });

  console.log("Unique years", uniqueYears);
  console.log("Northern Hemisphere counts", northCounts);
  console.log("Southern Hemisphere counts", southCounts);

  // Create the Plotly chart
  Plotly.newPlot(
    "line-graph",
    [
      {
        x: uniqueYears,
        y: northCounts,
        type: "line",
        name: "Northern Hemisphere",
        marker: {
          color: "#d62728",
        },
      },
      {
        x: uniqueYears,
        y: southCounts,
        type: "line",
        name: "Southern Hemisphere",
        marker: {
          color: "#17becf",
        },
      },
    ],
    {
      title: "Meteorite Landings per Year by Hemisphere",
      xaxis: {
        title: "Year",
      },
      yaxis: {
        title: "Number of Landings",
      },
    }
  );
}

// function for year selection
function setInputYear(min, max) {
  const input = document.querySelector("#choose-year");
  input.max = max;
  input.min = min;
  //input.value = min;
  // start with disabled as data can't be reached until page loads
  input.removeAttribute("disabled");
  //setInputLabel(min);
}

// function for label for slider bar
function setInputYear(year) {
    const label = document.querySelector("#starting-label");
    label.innerHTML = `Starting Year: ${year}`;
}

// function setYearInput(yearInput) {
//   const selectedYear = document.querySelector("#choose-year").addEventListener("change", handleYearSelectionChange);
// }

// // function for event listener for slider bar
// function handleYearSelectionChange(event) {
//     const { target } = event;
//     const { value } = target;
//     // set label
//     setInputYear(value);
//     // build the chart again based on selectors
//     buildBarChart(chartData, value, currentYear);
//   }

// create bar graph of mass
// function buildBarChart(data) {
//   //sort by highest mass
//   const sortedByMass = data.sort((a, b) => {
//     const massA = a.mass;
//     const massB = b.mass;
//     return massB - massA;
//   });
//   const topTenByMass = sortedByMass.slice(0, 10);

//   // set up layout and data for bar chart
//   const barData = [
//     {
//       x: topTenByMass.map((landing) => {
//         return landing.name;
//       }),
//       y: topTenByMass.map((landing) => {
//         return landing.mass;
//       }),
//       type: "bar",
//       marker: {
//         color: "skyblue",
//       },
//     },
//   ];
//   const layout = {
//     title: "Top Ten Mass",
//     xaxis: {
//       title: "Name",
//     },
//     yaxis: {
//       title: "Mass in Grams",
//     },
//   };

//   Plotly.newPlot("bar-graph", barData, layout);
// }
