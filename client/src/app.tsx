import React, {Component} from "react";
import {UAParser} from "ua-parser-js";
import {v4} from "uuid";
import BatteryStatus from "./battery-status";
import Geolocation from "./geolocation";
import MediaDevices from "./media-devices";
import SpeechSynthesis from "./speech-synthesis";
import WebAudio from "./web-audio";

declare namespace Faye {
  export class Client {
    constructor(url: string, options?: any);

    publish(channel: string, message: any): Promise<void>;

    subscribe(channel: string, cb: (message: any) => void): Promise<void> & { cancel: () => void };
  }
}

function getClientId() {
  const storedClientId = sessionStorage.getItem("clientId");
  if (storedClientId) {
    return storedClientId;
  } else {
    const clientId = v4();
    sessionStorage.setItem("clientId", clientId);
    return clientId;
  }
}

function getSessionId() {
  const matches = /session=([^&#]+)/.exec(window.location.search);

  if (matches) {
    const sessionId: string = matches[1];
    sessionStorage.setItem("sessionId", sessionId);
    return sessionId;
  } else if (sessionStorage.getItem("sessionId")) {
    return sessionStorage.getItem("sessionId");
  }
}

const fayeId = getClientId();
const fayeSessionId = getSessionId();
const browser = new UAParser().getBrowser();
const fayeClient = new Faye.Client("https://gzschaler.de/ws", { timeout: 45 });

function publish(channel: string, message: any) {
  return fayeClient.publish(`/${fayeSessionId}/${channel}`, message);
}

function subscribe(channel: string, cb: (message: any) => void) {
  return fayeClient.subscribe(`/${fayeSessionId}/${channel}`, cb);
}

console.log(`Initialising Faye client ${fayeId} for session ${fayeSessionId}`);

publish("connect", {id: fayeId, browser});

window.addEventListener("unload", () => publish("disconnect", {id: fayeId}));

const SOS_PATTERN = [120, 60, 120, 60, 120, 240, 240, 60, 240, 60, 240, 240, 120, 60, 120, 60, 120];

// TODO need user interaction before navigator.vibrate is allowed to be called
// @ts-ignore
const vibrate = (navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || (() => {
})).bind(navigator);

export default class App extends Component<{}, { page: string; speechSynthesisText: string }> {
  private subscriptions: (Promise<void> & { cancel: () => void })[] = [];

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {page: "", speechSynthesisText: ""};
  }

  componentDidMount() {
    this.subscriptions = [
      subscribe("connect/presenter", () => publish("connect", {id: fayeId, browser})),
      subscribe("heartbeat", ({page}: { page: string }) => this.setState({page})),
      subscribe("switch", ({page}: { page: string }) => this.setState({page})),
      subscribe("speech", ({text}: { text: string }) => this.setState({speechSynthesisText: text})),
      subscribe("vibrate", ({pattern = SOS_PATTERN}: { pattern: number[] }) => vibrate(pattern)),
    ];
  }

  componentWillUnmount() {
    this.subscriptions.forEach((s) => s.cancel());
  }

  render() {
    switch (this.state.page) {
      case "battery":
        return <BatteryStatus onChange={(e) => publish("update/battery", { ...e, id: fayeId })} />;
      case "geolocation":
        return <Geolocation onChange={(e) => publish("update/geolocation", { ...e, id: fayeId })} />;
      case "usermedia":
        return <MediaDevices />;
      case "speech":
        return <SpeechSynthesis text={this.state.speechSynthesisText} />;
      case "webaudio":
        return <WebAudio />;
      case "thankyou":
        return <div className="slide thankyou">Thank you!</div>;
      default:
        return <div className="slide">Hello!</div>;
    }
  }
}
