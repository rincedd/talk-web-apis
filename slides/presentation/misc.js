import React, { Component, PropTypes } from 'react';
import { Slide, Text } from 'spectacle';

export default class MiscSlide extends Component {
  static propTypes = {
    clientManager: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.clientManager.switchClients('misc');
  }

  render() {
    return <Slide>
      <Text>
        <button onClick={() => this.props.clientManager.triggerVibrate()}>Vibrate!</button>
      </Text>
    </Slide>
  }
}
