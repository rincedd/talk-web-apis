import React, {Component, PropTypes} from 'react';
import {Image} from 'spectacle';

export default class CrowsSlide extends Component {
  static propTypes = {
    clientManager: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.clientManager.switchClients('webaudio');
  }

  render() {
    return <Image src={require('../assets/web-audio-crow.svg')}/>;
  }
}