import Faye from 'faye/src/faye_browser';
import {v4} from 'uuid';
import UAParser from 'ua-parser-js';
import React, {Component} from 'react';
import {render} from 'react-dom';
import 'url-polyfill';
import BatteryStatus from './battery-status';
import Geolocation from './geolocation';
import SpeechSynthesis from './speech-synthesis';
import WebAudio from './web-audio';
import VideoStream from './video-stream';
import './client.css';

function getClientId() {
  const storedClientId = sessionStorage.getItem('clientId');
  if (storedClientId) {
    return storedClientId;
  } else {
    const clientId = v4();
    sessionStorage.setItem('clientId', clientId);
    return clientId;
  }
}

function getSessionId() {
  const url = new URL(window.location.href);
  if (url.searchParams.has('session')) {
    const sessionId = url.searchParams.get('session');
    sessionStorage.setItem('sessionId', sessionId);
    return sessionId;
  } else if (sessionStorage.getItem('sessionId')) {
    return sessionStorage.getItem('sessionId');
  }
}

const fayeId = getClientId();
const fayeSessionId = getSessionId();
const fayeClient = new Faye.Client('https://gzschaler.de/ws', {timeout: 45});

function publish(channel, message) {
  return fayeClient.publish(`/${fayeSessionId}/${channel}`, message);
}

function subscribe(channel) {
  return fayeClient.subscribe(`/${fayeSessionId}/${channel}`);
}

publish('connect', { id: fayeId, browser: new UAParser().getBrowser() });

window.addEventListener('unload', () => publish('disconnect', { id: fayeId }));

const SOS_PATTERN = [120, 60, 120, 60, 120, 240, 240, 60, 240, 60, 240, 240, 120, 60, 120, 60, 120];
const vibrate = (navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || (() => {
})).bind(navigator);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { page: '', speechSynthesisText: '' };
  }

  componentDidMount() {
    this.heartbeatSubscription = subscribe('heartbeat', ({ page }) => this.setState({ page }));
    this.pageSubscription = subscribe('switch', ({ page }) => this.setState({ page }));
    this.speechSubscription = subscribe('speech', ({ text }) => this.setState({ speechSynthesisText: text }));
    this.vibrateSubscription =  subscribe('vibrate', ({ pattern = SOS_PATTERN }) => vibrate(pattern));
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
        return <BatteryStatus onChange={e => publish('update/battery', { ...e, id: fayeId })} />;
      case 'geolocation':
        return <Geolocation onChange={e => publish('update/geolocation', { ...e, id: fayeId })} />;
      case 'webrtc':
        return <VideoStream pubSubClient={{publish, subscribe}} pubSubId={fayeId} />;
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
