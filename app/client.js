import Faye from 'faye/src/faye_browser';
import { v4 } from 'uuid';
import UAParser from 'ua-parser-js';
import React, { Component } from 'react';
import { render } from 'react-dom';
import BatteryStatus from './battery-status';
import Geolocation from './geolocation';
import './client.css';

const fayeId = v4();
const fayeClient = new Faye.Client('/faye', { timeout: 60 });
fayeClient.publish('/connect', { id: fayeId, browser: new UAParser().getBrowser() });

window.addEventListener('unload', () => fayeClient.publish('/disconnect', { id: fayeId }));

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { page: '' };
  }

  componentDidMount() {
    this.subscription = fayeClient.subscribe('/switch', ({ page }) => this.setState({ page }));
  }

  componentWillUnmount() {
    this.subscription.cancel();
  }

  render() {
    switch (this.state.page) {
      case 'battery':
        return <BatteryStatus onChange={e => fayeClient.publish('/battery', { ...e, id: fayeId })} />;
      case 'geolocation':
        return <Geolocation />;
      default:
        return <div>Hello!</div>;
    }
  }
}

render(<App />, document.querySelector('#app'));
