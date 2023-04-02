// set the map of the USA
let map = L.map("map", {
  center: [37.8, -96],
  zoom: 4
});

// Add tile layer 
// Add tile layers 
let streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://opentopomap.org/about">OpenTopoMap</a> contributors'
});

// Add tectonic overlay layer
let tectonic = L.geoJSON(null, {
  style: {
    color: "orange",
    weight: 2,
    opacity: 0.8
  }
}).addTo(map);



// Get the GeoJSON data for tectonic plates
let tectonicData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

d3.json(tectonicData)
  .then(function(data) {
    tectonic.addData(data);
  });

// Create a base layer object with multiple layers
let baseLayers = {
  "Street Map": streetLayer,
  "Topographic Map": topoLayer
};

let overlayLayers = {
  "Tectonic Plates": tectonic
};


// Add the base layer control to the map
L.control.layers(baseLayers, overlayLayers).addTo(map);


// Get the GeoJSON data

let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";

d3.json(geoData)
  .then(function(data) {


  // loop through each earthquake feature and add a marker to the map
  data.features.forEach(function(feature) {
    let mag = feature.properties.mag;
    let depth = feature.geometry.coordinates[2];
    let color = depth > 90 ? 'black' :
      depth > 50 ? 'darkred' :
      depth > 30 ? 'red' :
      depth > 10 ? 'darkorange' :
      depth > 0 ? 'gold' :
      'lightgreen';
    L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
      radius: mag * 3.5,
      fillColor: color,
      color: 'black',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }).bindPopup(`<strong>${feature.properties.place}</strong><br>Magnitude: ${mag}<br>Depth: ${depth}<p>${new Date(feature.properties.time)}</p>`)
    .addTo(map);
  });
});

//Add legend, note that changes to CSS were made in order to view the legend
// Define the colors and intervals for the legend
var colors = ['lightgreen', 'gold', 'darkorange', 'red', 'darkred', 'black'];
var intervals = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];

// Define the legend control
var legend = L.control({position: 'bottomright'});

// Define the legend items and color swatches
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'legend');
  for (var i = 0; i < intervals.length; i++) {
    var label = intervals[i];
    var color = colors[i];
    var legendItem = '<div class="legend-item"><div class="swatch" style="background-color: ' + color + '"></div><p class="label">' + label + '</p></div>';
    div.innerHTML += legendItem;
  }
  return div;
};

// Add the legend to the map
legend.addTo(map);
