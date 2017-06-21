var MapWrapper = function(container, coords, zoom){

  this.googleMap = new google.maps.Map(container, {
    center: coords,
    zoom: zoom
  })
}

MapWrapper.prototype = {

  addMarker: function(coords, description){

    var infowindow = new google.maps.InfoWindow({
      content: description
    });

    var marker = new google.maps.Marker({
      position: coords,
      map: this.googleMap
    });

    marker.addListener('click', function() {
      infowindow.open(null, marker); //we don't need a map in this case
    });
  }

}
