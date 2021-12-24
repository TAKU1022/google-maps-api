function initMap() {
  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: { lat: 35.665498, lng: 139.75964 },
  });

  var marker = new google.maps.Marker({
    position: { lat: 35.665498, lng: 139.75964 },
    map: map,
  });
}
