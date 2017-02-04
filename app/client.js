import Faye from 'faye/src/faye_browser';
import { v4 } from 'uuid';
import UAParser from 'ua-parser-js';
import React from 'react';
import { render } from 'react-dom';
import BatteryStatus from './battery-status';
import './client.css';

const fayeId = v4();
const client = new Faye.Client('/faye', { timeout: 60 });
client.publish('/connect', { id: fayeId, browser: new UAParser().getBrowser() });

window.addEventListener('unload', () => client.publish('/disconnect', { id: fayeId }));

const sendData = ({ charging, level }) => client.publish('/battery', { id: fayeId, batteryLevel: level, charging });

if (navigator.getBattery) {
  navigator.getBattery().then(sendData);
} else {
  sendData();
}

function App() {
  return <BatteryStatus />;
}

render(<App />, document.querySelector('#app'));
