import React, { Component } from "react";
import { render } from "react-dom";
import UAParser from "ua-parser-js";
import "url-polyfill";
import { v4 } from "uuid";
import BatteryStatus from "./battery-status";
import "./client.css";
import Geolocation from "./geolocation";
import MediaDevices from "./media-devices";
import SpeechSynthesis from "./speech-synthesis";
import WebAudio from "./web-audio";

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
  const url = new URL(window.location.href);
  if (url.searchParams.has("session")) {
    const sessionId = url.searchParams.get("session");
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

function publish(channel, message) {
  return fayeClient.publish(`/${fayeSessionId}/${channel}`, message);
}

function subscribe(channel, cb) {
  return fayeClient.subscribe(`/${fayeSessionId}/${channel}`, cb);
}

console.log(`Initialising Faye client ${fayeId} for session ${fayeSessionId}`);

publish("connect", { id: fayeId, browser });

window.addEventListener("unload", () => publish("disconnect", { id: fayeId }));

const SOS_PATTERN = [120, 60, 120, 60, 120, 240, 240, 60, 240, 60, 240, 240, 120, 60, 120, 60, 120];
const vibrate = (navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || (() => {
})).bind(navigator);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { page: "", speechSynthesisText: "" };
  }

  componentDidMount() {
    this.subscriptions = [
      subscribe("connect/presenter", () => publish("connect", { id: fayeId, browser })),
      subscribe("heartbeat", ({ page }) => this.setState({ page })),
      subscribe("switch", ({ page }) => this.setState({ page })),
      subscribe("speech", ({ text }) => this.setState({ speechSynthesisText: text })),
      subscribe("vibrate", ({ pattern = SOS_PATTERN }) => vibrate(pattern)),
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

render(<App />, document.querySelector("#app"));
