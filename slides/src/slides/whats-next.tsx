import React, {Component} from 'react';
import {Heading, Link, ListItem, UnorderedList} from 'spectacle';
import {ClientManager} from "./client-manager";

export default class WhatsNextSlide extends Component<{clientManager: ClientManager}> {
  componentDidMount() {
    this.props.clientManager.switchClients('thankyou');
  }

  render() {
    return <div>
      <Heading size={3}>And much more...</Heading>
      <UnorderedList>
        <ListItem><Link href="https://devdocs.io/dom/webgl_api">WebGL</Link>3D rendering contexts</ListItem>
        <ListItem><Link href="https://devdocs.io/dom/webrtc_api">WebRTC</Link>real-time peer-to-peer channels</ListItem>
        <ListItem><Link href="https://developer.mozilla.org/en-US/docs/Web/API/MIDIAccess">WebMIDI</Link>🎘 MIDI, yay!</ListItem>
        <ListItem><Link href="https://googlechrome.github.io/samples/web-nfc/">WebNFC</Link>: read NFC tags from the browser</ListItem>
        <ListItem><Link href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API">WebBluetooth</Link>: access Bluetooth devices</ListItem>
        <ListItem><Link href="https://www.w3.org/TR/webxr/">WebXR</Link>: access VR/AR devices</ListItem>
        <ListItem><Link href="https://whatwebcando.today">whatwebcando.today</Link></ListItem>
      </UnorderedList>
    </div>;
  }
}
