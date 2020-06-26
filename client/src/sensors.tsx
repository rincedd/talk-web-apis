import React, { Component } from "react";

declare class Sensor {
  constructor(opts: { frequency: number });
  start(): void;
  stop(): void;
  onreading(): void;
  onerror(event: { error: Error }): void;
}

declare class AmbientLightSensor extends Sensor {
  illuminance: number;
}

declare class Accelerometer extends Sensor {
  x: Readonly<number>;
  y: Readonly<number>;
  z: Readonly<number>;
}

declare class Gyroscope extends Sensor {
  x: Readonly<number>;
  y: Readonly<number>;
  z: Readonly<number>;
}

declare class Magnetometer extends Sensor {
  x: Readonly<number>;
  y: Readonly<number>;
  z: Readonly<number>;
}

type Feature = "accelerometer" | "gyroscope" | "magnetometer";

interface SensorsState {
  ambientLight: {
    illuminance: number;
    supported: boolean;
  };
  accelerometer: {
    supported: boolean;
    x: number;
    y: number;
    z: number;
  };
  gyroscope: {
    supported: boolean;
    x: number;
    y: number;
    z: number;
  };
  magnetometer: {
    supported: boolean;
    x: number;
    y: number;
    z: number;
  };
  error: Error | null;
}

export default class Sensors extends Component<any, SensorsState> {
  private ambientLightSensor?: AmbientLightSensor;
  private accelerometer?: Accelerometer;
  private gyroscope?: Gyroscope;
  private magnetometer?: Magnetometer;
  constructor(props: any) {
    super(props);

    this.state = {
      ambientLight: { supported: "AmbientLightSensor" in window, illuminance: 0 },
      accelerometer: { supported: "Accelerometer" in window, x: 0, y: 0, z: 0 },
      gyroscope: { supported: "Gyroscope" in window, x: 0, y: 0, z: 0 },
      magnetometer: { supported: "Magnetometer" in window, x: 0, y: 0, z: 0 },
      error: null,
    };
  }
  componentDidMount() {
    this.getPermissions();
    this.startAmbientLightSensor();
    this.startAccelerometer();
    this.startGyroscope();
    this.startMagnetometer();
  }

  private startAmbientLightSensor() {
    if (this.state.ambientLight.supported) {
      this.ambientLightSensor = new AmbientLightSensor({ frequency: 1 });
      this.ambientLightSensor.onreading = () => {
        this.ambientLightSensor &&
          this.setState({ ambientLight: { ...this.state.ambientLight, illuminance: this.ambientLightSensor.illuminance } });
      };
      this.ambientLightSensor.onerror = (event) => {
        this.setState({ error: event.error });
      };
      this.ambientLightSensor.start();
    }
  }

  private startAccelerometer() {
    if (this.state.accelerometer.supported) {
      this.accelerometer = new Accelerometer({ frequency: 30 });
      this.accelerometer.onreading = () => {
        this.accelerometer &&
          this.setState({
            accelerometer: { ...this.state.accelerometer, x: this.accelerometer.x, y: this.accelerometer.y, z: this.accelerometer.z },
          });
      };
      this.accelerometer.onerror = (event) => {
        this.setState({ error: event.error });
      };
      this.accelerometer.start();
    }
  }

  private startGyroscope() {
    if (this.state.gyroscope.supported) {
      this.gyroscope = new Gyroscope({ frequency: 30 });
      this.gyroscope.onreading = () => {
        this.gyroscope &&
          this.setState({
            gyroscope: { ...this.state.gyroscope, x: this.gyroscope.x, y: this.gyroscope.y, z: this.gyroscope.z },
          });
      };
      this.gyroscope.onerror = (event) => {
        this.setState({ error: event.error });
      };
      this.gyroscope.start();
    }
  }

  private startMagnetometer() {
    if (this.state.magnetometer.supported) {
      this.magnetometer = new Magnetometer({ frequency: 30 });
      this.magnetometer.onreading = () => {
        this.magnetometer &&
          this.setState({
            magnetometer: { ...this.state.magnetometer, x: this.magnetometer.x, y: this.magnetometer.y, z: this.magnetometer.z },
          });
      };
      this.magnetometer.onerror = (event) => {
        this.setState({ error: event.error });
      };
      this.magnetometer.start();
    }
  }

  private getPermissions() {
    const features: Feature[] = ["accelerometer", "gyroscope", "magnetometer"];
    features.forEach(async (feature: Feature) => {
      try {
        const permission = await navigator.permissions.query({ name: feature });

        if (permission.state === "granted" || permission.state === "prompt") {
          // @ts-ignore
          this.setState({ [feature]: { ...this.state[feature], supported: true } });
        }
      } catch (e) {
        // @ts-ignore
        this.setState({ [feature]: { ...this.state[feature], supported: false } });
      }
    });
  }

  componentWillUnmount() {
    this.ambientLightSensor?.stop();
    this.accelerometer?.stop();
    this.magnetometer?.stop();
    this.gyroscope?.stop();
  }

  render() {
    const { error, ambientLight, magnetometer, gyroscope, accelerometer } = this.state;
    return (
      <div className="slide sensors">
        {ambientLight.supported ? (
          <div>Current ambient illuminance is {ambientLight.illuminance}.</div>
        ) : (
          <div>Ambient light sensor not supported/permitted.</div>
        )}
        {accelerometer.supported ? (
          <div>
            Current acceleration: [{accelerometer.x}, {accelerometer.y}, {accelerometer.z}]
          </div>
        ) : (
          <div>Accelerometer access not supported/permitted.</div>
        )}
        {gyroscope.supported ? (
          <div>
            Current angular velocity: [{gyroscope.x}, {gyroscope.y}, {gyroscope.z}]
          </div>
        ) : (
          <div>Gyroscope access not supported/permitted.</div>
        )}
        {magnetometer.supported ? (
          <div>
            Current magnetic field: [{magnetometer.x}, {magnetometer.y}, {magnetometer.z}]
          </div>
        ) : (
          <div>Magnetometer access not supported/permitted.</div>
        )}
        {error && <div className="error">{error.message}</div>}
      </div>
    );
  }
}
