let map;
let marker;
let geocoder;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: { lat: 36.0047, lng: 137.5936 },
  });

  geocoder = new google.maps.Geocoder();
}

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

const changeMap = () => {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: { lat: 36.0047, lng: 137.5936 },
  });
};

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const value = e.currentTarget.firstElementChild.value;
  const api = await axios.get(
    `https://peaceful-bayou-19080.herokuapp.com/api/v1/place?value=${encodeURIComponent(
      value
    )}`
  );
  const results = api.data.results;

  if (!results.shop) {
    alert('条件を絞り込んでください。');
    return;
  }

  if (results.results_available === 0) {
    alert('ヒットした件数は0件です。');
    return;
  }

  results.shop
    .map((shop) => shop.address)
    .forEach((address) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          const bounds = new google.maps.LatLngBounds();

          if (results[0].geometry) {
            let latlng = results[0].geometry.location;

            bounds.extend(latlng);
            addMaker(latlng);
          }
        } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
          alert('見つかりません');
        } else {
          console.log(status);
          alert('文字を入力してください');
        }
      });
    });

  changeMap();
});
