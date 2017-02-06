import React, { Component } from 'react';

export default class Geolocation extends Component {
  constructor(props) {
    super(props);
    this.state = { position: { coords: {} } }
  }

  componentDidMount() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(p => this._updatePosition(p), error => this.setState({ error }));
    }
  }

  _updatePosition(position) {
    this.props.onChange({ latitude: position.coords.latitude, longitude: position.coords.longitude });
    this.setState({
      position,
      error: null
    });
  }

  render() {
    if ('geolocation' in navigator) {
      if (this.state.error) {
        return <div className="slide geolocation error">Error obtaining geolocation: {this.state.error.message}</div>
      }
      return <div className="slide geolocation">
        Latitude: {this.state.position.coords.latitude}<br />
        Longitude: {this.state.position.coords.longitude}
      </div>
    }
    return <div>Your browser does not support the Geolocation API.</div>
  }
}
