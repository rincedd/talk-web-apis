import React, {Component} from 'react';
import {Text} from 'spectacle';
import {ClientManager} from "./client-manager";

export default class MiscSlide extends Component<{clientManager: ClientManager}> {
  componentDidMount() {
    this.props.clientManager.switchClients('misc');
  }

  render() {
    return <div>
      <Text>
        <button onClick={() => this.props.clientManager.triggerVibrate()}>Vibrate!</button>
      </Text>
    </div>
  }
}
