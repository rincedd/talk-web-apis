import Faye from 'faye/src/faye_browser';
import { v4 } from 'uuid';

const fayeId = v4();
const client = new Faye.Client('/faye', { timeout: 60 });
client.publish('/connect', { id: fayeId });

const sendData = ({ charging, level }) => client.publish('/battery', { id: fayeId, batteryLevel: level, charging });

if (navigator.getBattery) {
  navigator.getBattery().then(sendData);
} else {
  sendData();
}
