function initMap() {
  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: { lat: 35.772296190919874, lng: 139.51982984246817 },
  });

  let marker = new google.maps.Marker({
    position: { lat: 35.772296190919874, lng: 139.51982984246817 },
    map,
  });

  let geocoder = new google.maps.Geocoder();

  const deleteMakers = () => {
    if (marker != null) {
      marker.setMap(null);
    }
    marker = null;
  };

  const changeMap = (place) => {
    deleteMakers();

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: place,
    });
    marker = new google.maps.Marker({
      position: place,
      map,
    });
  };

  document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    let address = e.currentTarget.firstElementChild.value;

    geocoder.geocode({ address }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        const bounds = new google.maps.LatLngBounds();

        for (let i in results) {
          if (results[0].geometry) {
            let latlng = results[0].geometry.location;

            bounds.extend(latlng);
            changeMap(latlng);
          }
        }
      } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
        alert('見つかりません');
      } else {
        console.log(status);
        alert('文字を入力してください');
      }
    });
  });
}
