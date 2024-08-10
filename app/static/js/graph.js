console.log("graph here");
// globals
const currentYear = new Date().getFullYear();
let chartData;

function init() {
  fetch("/api/v1/data")
    .then((response) => response.json())
    .then((data) => {
      // hre do stuff
      console.log(data);
      // save data as a global variable for data
      chartData = data
      // determine last 50 years
      const startYear = currentYear - 200;
      // set input bounds
      setInputBounds(startYear, currentYear);
      buildChart(data, startYear, currentYear);
    })
    .catch((error) => console.error(error));
}

init();

function setInputBounds(min, max) {
    const input = document.querySelector("#year-select");
    input.max = max;
    input.min = min;
    input.value = min;
    // start with disabled as data can't be reached until page loads
    input.removeAttribute('disabled');
    setInputLabel(min);
}

function setInputLabel(year) {
    const label = document.querySelector("#starting-label");
    label.innerHTML = `Starting Year: ${year}`;
}

function handleSliderChange(event) {
    const { target } = event;
    const { value } = target;
    // set label
    setInputLabel(value);
    // build the chart again based on selectors
    buildChart(chartData, value, currentYear);
}

function buildChart(data, startYear, currentYear) {
    // Filter data to include only the last 50 years
    const filteredData = data.filter((landing) => {
        return landing.year >= startYear && landing.year <= currentYear;
    });

    // Separate the data by hemisphere
    const northData = filteredData.filter(landing => landing.lat >= 0);
    const southData = filteredData.filter(landing => landing.lat < 0);

    // Get the years from the filtered data
    const years = filteredData.map((landing) => {
        return landing.year;
    });
    console.log("years", years);

    // Get unique years and sort them
    const uniqueYears = [...new Set(years)].sort((a, b) => a - b);
    console.log("unique years", uniqueYears);

    // Get counts for Northern Hemisphere
    const northCounts = uniqueYears.map(year => {
        return northData.filter(landing => landing.year === year).length;
    });
    
    // Get counts for Southern Hemisphere
    const southCounts = uniqueYears.map(year => {
        return southData.filter(landing => landing.year === year).length;
    });

    console.log("Unique years", uniqueYears);
    console.log("Northern Hemisphere counts", northCounts);
    console.log("Southern Hemisphere counts", southCounts);

    // // Get the counts of the number of landings per year
    // const counts = uniqueYears.map((year) => {
    //     return data.filter(landing => landing.year === year).length;
    // });
    // console.log("counts", counts);

    // Create the Plotly chart
    Plotly.newPlot("graph", [{
        x: uniqueYears,
        y: northCounts,
        type: "line",
        name: "Northern Hemisphere",
        marker: {
            color: "rgb(255, 217, 102)"
        }
    }, {
        x: uniqueYears,
        y: southCounts,
        type: "line",
        name: "Southern Hemisphere",
        marker: {
            color: "rgb(234, 153, 153)"
        }
    }], {
        title: "Meteorite Landings per Year by Hemisphere",
        xaxis: {
            title: "Year"
        },
        yaxis: {
            title: "Number of Landings"
        }
    });
}
