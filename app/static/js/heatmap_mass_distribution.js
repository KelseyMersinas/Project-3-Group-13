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

function createMap(data) {
  let myMap = L.map('map').setView([51.505,-0.09], 13);
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  L.control.layers(baseMaps, {}, {
    collapsed: false
  }).addTo(myMap);
}

/*/

function createMap(data) {

// Create map
let myMap = L.map('map').setView([51.505, -0.09], 13);

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

// {
  // Once we get a response, send the data.features object to the createFeatures function.
//   createFeatures(data.features);
// });

// function createFeatures(meteoriteData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that includes the mass for each meteor
  // function onEachFeature(feature, layer) {
  //   layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  // }

  // function generateMarker(feature, latlng){
  //   let markerOptions = {
  //       radius: feature.properties.mag *5,
  //       fillColor: "#BE0303",
  //       color: "#410202",
  //       weight: 1,
  //       opacity: 1,
  //       fillOpacity: feature.geometry.coordinates[2] / 40.0
  //   };
  //   return L.circleMarker(latlng, markerOptions);
  // }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  // let meteorites = L.geoJSON(earthquakeData, {
  //   onEachFeature: onEachFeature,
  //   pointToLayer: generateMarker
  // });

  // Send our earthquakes layer to the createMap function/
 // createMap(earthquakes);
// }

// function createMap(earthquakes) {


  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Meteorites: meteorites
  };



  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

//   // Create a legend
//  let legend = L.control({position: "bottomright" });

//  legend.onAdd = function (map) {
//     let div = L.DomUtil.create("div", "info legend");
//     div.innerHTML = "<b>Legend</b><br/>Larger circle equals higher magnitude <br/> Darker color equals lower depth"
//     return div;
// }
// legend.addTo(myMap);

}
//*/
