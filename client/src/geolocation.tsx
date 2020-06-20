import React, {Component} from "react";

export default class Geolocation extends Component<{ onChange: (pos: { latitude: number; longitude: number }) => any },
  { supported: boolean; position?: Position; error: Error | PositionError | null }> {
  constructor(props: Readonly<{ onChange: (pos: { latitude: number; longitude: number }) => any }>) {
    super(props);
    this.state = {supported: "geolocation" in navigator, error: null};
  }

  componentDidMount() {
    if (this.state.supported) {
      navigator.geolocation.getCurrentPosition(this.updatePosition, (error) => this.setState({error}));
    }
  }

  updatePosition = (position: Position) => {
    this.props.onChange({latitude: position.coords.latitude, longitude: position.coords.longitude});
    this.setState({
      position,
      error: null,
    });
  };

  render() {
    if (this.state.supported) {
      if (this.state.error) {
        return <div className="slide geolocation error">Error obtaining geolocation: {this.state.error.message}</div>;
      }
      return (
        <div className="slide geolocation">
          Latitude: {this.state.position?.coords.latitude}
          <br />
          Longitude: {this.state.position?.coords.longitude}
        </div>
      );
    }
    return <div>Your browser does not support the Geolocation API.</div>;
  }
}
