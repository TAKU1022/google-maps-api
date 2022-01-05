let map = null;
let markerList = [];
let infoWindowList = [];
let geocoder = null;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: { lat: 36.0047, lng: 137.5936 },
  });
  geocoder = new google.maps.Geocoder();
}

const addMaker = (i, place) => {
  markerList[i] = new google.maps.Marker({
    position: place,
    map,
  });
};

const addInfoWindow = (i, shopName) => {
  infoWindowList[i] = new google.maps.InfoWindow({ content: shopName });
};

const onClickMarker = (i) => {
  markerList[i].addListener('click', () => {
    map.panTo(markerList[i].getPosition());
    map.setZoom(16);

    infoWindowList[i].open(map, markerList[i]);
  });
};

const deleteMakers = () => {
  markerList.forEach((marker) => {
    if (marker != null) {
      marker.setMap(null);
    }
  });
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
  const hitNumber = document.getElementById('hit-number');
  if (hitNumber.firstChild) {
    hitNumber.removeChild(hitNumber.firstChild);
  }
  hitNumber.appendChild(
    document.createTextNode(`${results.results_available}件ヒットしました`)
  );

  if (!results.shop) {
    hitNumber.removeChild(hitNumber.firstChild);
    alert('条件を絞り込んでください。');
    return;
  }

  if (results.results_available === 0) {
    return;
  }

  results.shop.forEach((shopData, i) => {
    geocoder.geocode({ address: shopData.address }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        const bounds = new google.maps.LatLngBounds();

        if (results[0].geometry) {
          let latlng = results[0].geometry.location;

          bounds.extend(latlng);
          addMaker(i, latlng);
          addInfoWindow(i, shopData.name);
          onClickMarker(i);
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
  deleteMakers();
});
