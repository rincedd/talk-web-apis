// promise-based API
navigator.getBattery().then(battery => {
  if (battery.charging) {
    console.log('battery is charging');
  }
  console.log(`${battery.level * 100} % battery remaining`);

  battery.addEventListener('chargingchange', () => {
    console.log('charging status changed');
  });

  battery.addEventListener('levelchange', () => {
    console.log('battery level changed');
  });
});
