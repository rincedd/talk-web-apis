// only allowed on HTTPS pages
navigator.geolocation.getCurrentPosition(
  p => {
    console.log(p.coords.latitude, p.coords.longitude);
  },
  error => {
    console.error('Some error', error);
  },
  {
    enableHighAccuracy: true
  }
);

const watchId = navigator.geolocation.watchPosition(
  p => {
    console.log('new position', p.coords);
  },
  error => console.error(error)
);

navigator.geolocation.clearWatch(watchId);
