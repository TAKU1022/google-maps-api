let apiData = null;

let map;
let marker;
let geocoder;

const addMaker = (place) => {
  marker = new google.maps.Marker({
    position: place,
    map,
  });
};

const deleteMakers = () => {
  if (marker != null) {
    marker.setMap(null);
  }
  marker = null;
};

const changeMap = (place) => {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: place,
  });
};

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: { lat: 35.772296190919874, lng: 139.51982984246817 },
  });

  marker = new google.maps.Marker({
    position: { lat: 35.772296190919874, lng: 139.51982984246817 },
    map,
  });

  geocoder = new google.maps.Geocoder();

  document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const value = e.currentTarget.firstElementChild.value;

    const api = await axios.get(
      `https://peaceful-bayou-19080.herokuapp.com/api/v1/place?value=${encodeURIComponent(
        value
      )}`
    );

    if (api.data) {
    }

    console.log(api.data);

    geocoder.geocode({ address: value }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        const bounds = new google.maps.LatLngBounds();

        if (results[0].geometry) {
          let latlng = results[0].geometry.location;

          bounds.extend(latlng);
          changeMap(latlng);
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
