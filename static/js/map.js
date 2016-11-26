var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 32.757, lng: -117.069},
    zoom: 10
  });
}
