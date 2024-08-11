// Store our API endpoint as queryUrl.
let queryUrl = "api/v1/mass_distribution";

// Perform a GET request to the query URL/
d3.json(queryUrl)
  .then(data => {
    console.log(data);
    createMap(data);
})
.catch(error => {
  console.error('There was a problem with your fetch operation', error);
});

// Get the basic map
function createMap(data) {
  let myMap = L.map('map').setView([45.0, -90.0], 6);
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Handle map click event to show meteorite information
  myMap.on('click', function(e) {
    let clickedLatLng = e.latlng;
    let clickedMeteorite = data.find(d => {
      let meteoriteLatLng = L.latLng(d.lat, d.long);
      return clickedLatLng.distanceTo(meteoriteLatLng) < 10000; // Adjust the distance threshold as needed
    });
  
    if (clickedMeteorite) {
      console.log(clickedMeteorite);
      let popupContent = `<h3>${clickedMeteorite.name}</h3><hr><p>${clickedMeteorite.year}</p><p>${clickedMeteorite.mass}</p>`;
      L.popup()
        .setLatLng(clickedLatLng)
        .setContent(popupContent)
        .openOn(myMap);
    }
  });

  // Create a heatmap layer using the fetched data
  // We got the information on the L.heatlayer plug in from the leaflet.heat demo in github.
  let heatmapLayer = L.heatLayer(data.map(d => [d.lat, d.long, d.mass]), { radius: 15});

  // Add the heatmap layer to the map
  heatmapLayer.addTo(myMap);

  L.control.layers(baseMaps, null, { "Heatmap": heatmapLayer}, {
    collapsed: false
  }).addTo(myMap);

// Create a legend
 let legend = L.control({position: "bottomright" });

 legend.onAdd = function (map) {
    let div = L.DomUtil.create("div", "info legend");
    div.innerHTML = "<b>Information</b><br/>Click on a landing to see the name, year, and mass.<br/> A higher concentration of red indicates a higher amount of mass from meteorite landings in that area.<br/>Individual landings with darker centers have a higher mass"
    return div;
}
legend.addTo(myMap);
}

