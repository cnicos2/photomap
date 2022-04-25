function createPhotoMap () {
  // URL of a Google Sheets spreadsheet output as CSV
  var csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnmEGjwsiQe8_E5gaEQ2V7MdeI-Bg05WMJvhU3nAWATAVQBQSvyJLEBbKxPHPjq-tDgeYpdGps9Nzz/pub?gid=0&single=true&output=csv';
  
  // create map object with center lat/lon and zoom level
  var map = L.map('map').setView([-73.79247488576375, 41.134927298224156], 4);
  
  // create basemap object. See examples at https://leaflet-extras.github.io/leaflet-providers/preview/
  var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: 'Open Street Map.Mapnik' 
  }).addTo(map);
  
  // use Papa Parse (papaparse.com) to get the Google Sheets CSV
  Papa.parse(csvUrl, {
    download: true,
    header: true, 
    dynamicTyping: true,
    complete: function(csv) {
      // declare variables
      var place, marker, markersLayer;
      
      // create a layer where marker (point) features will be saved from the CSV
      markersLayer = L.featureGroup().addTo(map);

      // go through each row of the CSV to save the values to a marker
      for (row in csv.data) {
        place = csv.data[row];
        marker = L.marker([place.lat, place.long])
          .bindTooltip(place.name, {permanent: true}) // show labels by default
          .addTo(markersLayer);
        marker.properties = {
          name: place.name,
          description: place.description,
          pic_url: place.pic_url
        };
        
      } // end of for (row in csv.data) {...
      
      // create a function to show CSV values in a popup when a marker is clicked
      markersLayer.on("click", function(event) {
        var place = event.layer.properties;
        $('.modal').modal('show');
        $('.modal-title').html(place.name)
        $('.modal-body').html(place.description + '<br><img src="' + place.pic_url + '">')
      });
      
    } // end of complete: function(csv) {...
      
  }); // end of Papa.parse(csvUrl, {...
  
  // close the popup when x or close button is clicked
  $('.closeButton').on('click', function(e){
    $('.modal').modal('hide');
  })
  
} // end of function createPhotoMap () {...

// create the map after the rest of the page has loaded
window.addEventListener('load', createPhotoMap);
