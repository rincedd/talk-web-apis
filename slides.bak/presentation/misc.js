import React, { Component, PropTypes } from 'react';
import { Text } from 'spectacle';

export default class MiscSlide extends Component {
  static propTypes = {
    clientManager: PropTypes.object.isRequired
  };

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
