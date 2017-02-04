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

function App() {
  return <BatteryStatus onChange={e => client.publish('/battery', { ...e, id: fayeId })} />;
}

render(<App />, document.querySelector('#app'));
