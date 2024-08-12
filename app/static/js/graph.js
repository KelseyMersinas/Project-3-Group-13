// globals
const MAX_YEAR = 2016;
const MIN_YEAR = 1950;
let endingYear = MAX_YEAR;
let startYear = MIN_YEAR;
let chartData;

function init() {
  fetch("/api/v1/data")
    .then((response) => response.json())
    .then((data) => {
      // check data is loading correctly
      console.log(data);
      // save data as a global variable for data
      chartData = data;
      // set input bounds
      setInputBounds(startYear, endingYear, true);
      setEndingInputBounds(startYear, endingYear, true);
      setInputLabel(startYear);
      setEndingInputLabel(endingYear);
      // build graphs
      buildLineGraph(data, startYear, endingYear);
      buildBarChart(data, startYear, endingYear);
    })
    .catch((error) => console.error(error));
}

init();

// function for slider bar
function setInputBounds(min, max, setValue = false) {
  const input = document.querySelector("#year-select");
  input.max = max;
  input.min = MIN_YEAR;
  if (setValue) {
    input.value = min;
    setInputLabel(min);
  } 
  // start with disabled as data can't be reached until page loads
  input.removeAttribute("disabled");
}

// function for slider bar
function setEndingInputBounds(min, max, setValue = false) {
  const input = document.querySelector("#ending-year-select");
  input.max = MAX_YEAR;
  input.min = min;
  if (setValue) {
    input.value = max;
    setInputLabel(max);
  }
  // start with disabled as data can't be reached until page loads
  input.removeAttribute("disabled");
}

// function for label for slider bar
function setInputLabel(year) {
  const label = document.querySelector("#starting-label");
  label.innerHTML = `Starting Year: ${year}`;
}

// function for label for slider bar
function setEndingInputLabel(year) {
  const label = document.querySelector("#ending-label");
  label.innerHTML = `Ending Year: ${year}`;
}

// function for event listener for slider bar
function handleSliderChange(event) {
  const { target } = event;
  const { value } = target;
  // set label
  setInputLabel(value);
  startYear = value;
  setEndingInputBounds(parseInt(startYear) + 1, endingYear);
  // build the chart again based on selectors
  buildLineGraph(chartData, startYear, endingYear);
  buildBarChart(chartData, startYear, endingYear);
}

function handleEndingSliderChange(event) {
  const { target } = event;
  const { value } = target;
  // set label
  setEndingInputLabel(value);
  endingYear = value;
  setInputBounds(startYear, endingYear - 1);
  console.log(endingYear, "endingYear");
    // build the chart again based on selectors
  buildLineGraph(chartData, startYear, endingYear);
  buildBarChart(chartData, startYear, endingYear);
}

// build line graph
function buildLineGraph(data, startYear, endingYear) {
  // Filter data to include only the last 50 years
  const filteredData = data.filter((landing) => {
    return landing.year >= startYear && landing.year <= endingYear;
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
function setInputLabel(year) {
  const label = document.querySelector("#starting-label");
  label.innerHTML = `Starting Year: ${year}`;
}

function setYearInput(yearInput) {
  const selectedYear = document
    .querySelector("#choose-year")
    .addEventListener("change", handleYearSelectionChange);
}

// function for event listener for slider bar
function handleYearSelectionChange(event) {
  const { target } = event;
  const { value } = target;
  // set label
  setInputYear(value);
  // build the chart again based on selectors
  buildBarChart(chartData, value, endingYear);
}

// create bar graph of top mass from selected year
function buildBarChart(data, startYear, endingYear) {
  //sort by highest mass
  const sortedByMass = data.sort((a, b) => {
    const massA = a.mass;
    const massB = b.mass;
    return massB - massA;
  });
  // filter by year selected
  const filteredByYear = sortedByMass.filter(
    ({ year }) => year >= startYear && year <= endingYear
  );
  //just take the top 10
  const topTenByMass = filteredByYear.slice(0, 10);

  // Set up hover data for bar chart
  const hoverText = topTenByMass.map(chartData => {
    return `Year: ${chartData.year}<br>RecClass: ${chartData.recclass}<br>GeoLocation: ${chartData.GeoLocation}`;
  });

  // set up layout and data for bar chart
  const barData = [
    {
      x: topTenByMass.map((landing) => {
        return landing.name;
      }),
      y: topTenByMass.map((landing) => {
        return landing.mass;
      }),
      type: "bar",
      marker: {
        color: "skyblue",
      },
      text: hoverText,
      hoverInfo: "text",
    },
  ];
  const layout = {
    title: "Top Ten by Mass",
    xaxis: {
      title: "Meteorite Name",
    },
    yaxis: {
      title: "Mass in Grams",
    },
  };

  Plotly.newPlot("bar-graph", barData, layout);
}