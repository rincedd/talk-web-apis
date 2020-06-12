import React, {Component} from 'react';
import {Image} from 'spectacle';
import {ClientManager} from "./client-manager";

export default class CrowsSlide extends Component<{clientManager: ClientManager}> {

  componentDidMount() {
    this.props.clientManager.switchClients('webaudio');
  }

  render() {
    return <Image src={require('../assets/web-audio-crow.svg')}/>;
  }
}
