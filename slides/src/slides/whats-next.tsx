import React, {Component} from 'react';
import {Heading, Link, ListItem, UnorderedList} from 'spectacle';
import {ClientManager} from "./client-manager";

export default class WhatsNextSlide extends Component<{clientManager: ClientManager}> {
  componentDidMount() {
    this.props.clientManager.switchClients('thankyou');
  }

  render() {
    return <div>
      <Heading size={3}>What's next?</Heading>
      <UnorderedList>
        <ListItem><Link href="https://webvr.info/">WebVR</Link>: access VR devices</ListItem>
        <ListItem><Link href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API">WebBluetooth</Link></ListItem>
      </UnorderedList>
    </div>;
  }
}