import Faye from 'faye/src/faye_browser';
import {v4} from 'uuid';
import UAParser from 'ua-parser-js';
import React, {Component} from 'react';
import {render} from 'react-dom';
import BatteryStatus from './battery-status';
import Geolocation from './geolocation';
import SpeechSynthesis from './speech-synthesis';
import WebAudio from './web-audio';
import VideoStream from './video-stream';
import './client.css';

const fayeId = v4();
const fayeClient = new Faye.Client('/faye', { timeout: 60 });
fayeClient.publish('/connect', { id: fayeId, browser: new UAParser().getBrowser() });

window.addEventListener('unload', () => fayeClient.publish('/disconnect', { id: fayeId }));

const SOS_PATTERN = [120, 60, 120, 60, 120, 240, 240, 60, 240, 60, 240, 240, 120, 60, 120, 60, 120];
const vibrate = (navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || (() => {
})).bind(navigator);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { page: '', speechSynthesisText: '' };
  }

  componentDidMount() {
    this.heartbeatSubscription = fayeClient.subscribe('/heartbeat', ({ page }) => this.setState({ page }));
    this.pageSubscription = fayeClient.subscribe('/switch', ({ page }) => this.setState({ page }));
    this.speechSubscription = fayeClient.subscribe('/speech', ({ text }) => this.setState({ speechSynthesisText: text }));
    this.vibrateSubscription = fayeClient.subscribe('/vibrate', ({ pattern = SOS_PATTERN }) => vibrate(pattern));
  }

  componentWillUnmount() {
    this.heartbeatSubscription.cancel();
    this.pageSubscription.cancel();
    this.speechSubscription.cancel();
    this.vibrateSubscription.cancel();
  }

  render() {
    switch (this.state.page) {
      case 'battery':
        return <BatteryStatus onChange={e => fayeClient.publish('/update/battery', { ...e, id: fayeId })} />;
      case 'geolocation':
        return <Geolocation onChange={e => fayeClient.publish('/update/geolocation', { ...e, id: fayeId })} />;
      case 'webrtc':
        return <VideoStream pubSubClient={fayeClient} pubSubId={fayeId} />;
      case 'speech':
        return <SpeechSynthesis text={this.state.speechSynthesisText} />;
      case 'webaudio':
        return <WebAudio />;
    case 'thankyou':
      return <div className="slide thankyou">Thank you!</div>;
      default:
        return <div className="slide">Hello!</div>;
    }
  }
}

render(<App />, document.querySelector('#app'));
