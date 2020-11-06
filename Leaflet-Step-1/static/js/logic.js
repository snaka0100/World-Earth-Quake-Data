
//reference Day 1 Activity 10 for using earthquake data 

var geoUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(geoUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {
  
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h1>Location: " + feature.properties.place + "</h1> <hr> <h3>M " + feature.properties.mag + 
      "</h3> <hr> <h3>Depth: "+ feature.geometry.coordinates[2] + "m</h3>")
    }
  
    
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array

    //use the link below as refernce on how to use circle marker with geoJSON
    //https://stackoverflow.com/questions/25364072/how-to-use-circle-markers-with-leaflet-tilelayer-geojson
    function geojsonMarkerOptions(feature){
      //tried using the switch but never worked for some reason 
      //https://imagecolorpicker.com/ use this link to replicate the color in the example
      depth = feature.geometry.coordinates[2]
      color = "black"
      if (depth > 90){
        color = "#ff5f65"
      }
      else if (depth > 70){
        color = "#fca35d"
      }
      else if (depth > 50){
        color = "#fdb72a"
      }
      else if (depth > 30){
        color = "#f7db11"
      }
      else if (depth > 10){
        color = "#dcf400"
      }
      else {
        color = "#a3f600"
      }
      
      
      return {
        radius: feature.properties.mag * 4,
        fillColor: color,
        color: "black",
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.8
      }
    }
    var earthquakes = L.geoJSON(earthquakeData, {
    
    pointToLayer: function(feature, latlng) {
      return new L.CircleMarker(latlng, geojsonMarkerOptions(feature))
    },
    onEachFeature: onEachFeature
    });
    
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }
  //color depending on the mag Day 2 Acticity 1
  //this part of the code never worked so used if/else
  // function chooseColor(depth) {
  //   switch (depth) {
  //   case depth > 90:
  //     return "#ff5f65";
  //   case depth > 70:
  //     return "#fca35d";
  //   case depth > 50:
  //     return "#fdb72a";
  //   case depth > 30:
  //     return "#f7db11";
  //   case depth > 10:
  //     return "#a3f600"";
  //   default:
  //     return "black";
  //   }
  // }
  
  function createMap(earthquakes) {
  
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });
  
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
    //day 2 activity 4
    //adding legend
    //ref http://opensourcegisblog.blogspot.com/2014/09/an-introduction-to-leaflet-part-ii.html
    //ref http://jsfiddle.net/3v7hd2vx/34/
    //ref https://leafletjs.com/examples/choropleth/
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function(myMap) {
      var div = L.DomUtil.create('div', 'info legend');
      color = ["#a3f600","#dcf400","#f7db11","#fdb72a","#fca35d","#ff5f65"]
      grades = ['-10-10', '10-30', '30-50', '50-70','70-90','90+'];
      //inorder to add the color you must edit the css file with the lable 'info legend'
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +='<i style="background:' + color[i] + '"></i>' + grades[i]+'<br>';
        
      }

      return div;
    };
    legend.addTo(myMap);
  }
  