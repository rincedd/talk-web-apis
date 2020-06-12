import React, {Component, PropTypes} from 'react';
import {Heading, Link, List, ListItem} from 'spectacle';

export default class WhatsNextSlide extends Component {
  static propTypes = {
    clientManager: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.clientManager.switchClients('thankyou');
  }

  render() {
    return <div>
      <Heading size={3}>What's next?</Heading>
      <List>
        <ListItem><Link href="https://webvr.info/">WebVR</Link>: access VR devices</ListItem>
        <ListItem><Link href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API">WebBluetooth</Link></ListItem>
      </List>
    </div>;
  }
}