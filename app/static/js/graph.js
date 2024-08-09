console.log("graph here");
function init() {
  fetch("/api/v1/data")
    .then((response) => response.json())
    .then((data) => {
      // hre do stuff
      console.log(data);
      buildChart(data);
    })
    .catch((error) => console.error(error));
}

init();

function buildChart(data) {
    // determine last 50 years
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 50;

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
            color: "rgba(67,67,67,1)"
        }
    }, {
        x: uniqueYears,
        y: southCounts,
        type: "line",
        name: "Southern Hemisphere",
        marker: {
            color: "rgba(115,115,115,1)"
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
