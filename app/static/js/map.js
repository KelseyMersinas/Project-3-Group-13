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
  let myMap = L.map('map').setView([45.0, -90.0], 4);
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




  let markers = L.markerClusterGroup();
  let markerArray = [];

  for (let i = 0; i < data.length; i++) {
    let row = data[i];
    console.log(row.name);
    let latitude = row.lat;
    let longitude = row.long;
    let point = [latitude, longitude];

    let marker = L.marker(point);
    let popup = `<h1>${row.name}</h1><hr><h2>${row.lat}, ${row.long}</h2><hr><h3>Mass: ${row.mass} lbs <h4>${row.year}</h4>`;
    marker.bindPopup(popup);
    markers.addLayer(marker);
    markerArray.push(point);
  }
  markers.addTo(myMap);

// Handle map click event to show meteorite information
// myMap.on('click', function(e) {
//   let clickedLatLng = e.latlng;
//   let clickedMeteorite = data.find(d => {
//     let meteoriteLatLng = L.latLng(d.lat, d.long);
//     return clickedLatLng.distanceTo(meteoriteLatLng) < 10000; // Adjust the distance threshold as needed
//   });
//   if (clickedMeteorite) {
//     console.log(clickedMeteorite);
//     let popupContent = `<h3>Name: ${clickedMeteorite.name}</h3>
//     <hr>
//     <p>Year: ${clickedMeteorite.year}</p>
//     <p>Class: ${clickedMeteorite.recclass}</p>
//     <p>Mass: ${clickedMeteorite.mass}</p>`;
//     L.popup()
//       .setLatLng(clickedLatLng)
//       .setContent(popupContent)
//       .openOn(myMap);
//   }
// });

  // Add the heatmap layer to the map
 // markerCluster.addTo(myMap);

  L.control.layers(baseMaps, null, { "Marker Clusters": markers}, {
    collapsed: false
  }).addTo(myMap);

// Create a legend
 let legend = L.control({position: "bottomright" });

 legend.onAdd = function (map) {
    let div = L.DomUtil.create("div", "info legend");
    div.innerHTML = "<b>Information</b><br/>Click on a landing to see the Name, Location, Mass, and Year."
    return div;
}
legend.addTo(myMap);
}

