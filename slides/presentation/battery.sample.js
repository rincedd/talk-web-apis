navigator.getBattery().then(batteryManager => {
  if (batteryManager.charging) {
    console.log('battery is charging');
  }
  console.log(`${batteryManager.level} % battery remaining`);
});
