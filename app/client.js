import Faye from 'faye/src/faye_browser';
import { v4 } from 'uuid';

const fayeId = v4();
const client = new Faye.Client('/faye', { timeout: 60 });
client.publish('/connect', { id: fayeId });

const sendData = batteryLevel => client.publish('/battery', { id: fayeId, batteryLevel });

if (navigator.getBattery) {
  navigator.getBattery().then(battery => sendData(battery.level));
} else {
  sendData();
}
