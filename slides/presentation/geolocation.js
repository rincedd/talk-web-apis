import React, { Component } from 'react';
import { Slide, Heading } from 'spectacle';

export default class GeolocationSlide extends Component {
  componentDidMount() {
    this.props.clientManager.switchClients('geolocation');
  }

  render() {
    return <Slide>
      <Heading size={3}>Geolocation API</Heading>
    </Slide>;
  }
}
