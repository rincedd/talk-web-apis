import React, { Component } from "react";

declare class AmbientLightSensor {
  illuminance: number;
  start(): void;
  stop(): void;
  onreading(): void;
  onerror(event: { error: Error }): void;
}

export default class Sensors extends Component<any, { illuminance: number; supported: boolean; error: Error | null }> {
  private sensor?: AmbientLightSensor;
  constructor(props: any) {
    super(props);
    this.state = { supported: "AmbientLightSensor" in window, illuminance: 0, error: null };
  }
  componentDidMount() {
    if (this.state.supported) {
      this.sensor = new AmbientLightSensor();
      this.sensor.onreading = () => {
        this.sensor && this.setState({ illuminance: this.sensor.illuminance });
      };
      this.sensor.onerror = (event) => {
        this.setState({ error: event.error });
      };
      this.sensor.start();
    }
  }

  componentWillUnmount() {
    this.sensor?.stop();
  }

  render() {
    if (this.state.supported) {
      return (
        <div className="slide sensors">
          Current ambient illuminance is {this.state.illuminance};
          {this.state.error && <div className="error">{this.state.error.message}</div>}
        </div>
      );
    } else {
      return <div className="slide sensors">Accessing the Ambient Light Sensor is not supported/permitted on your device.</div>;
    }
  }
}
