import React, {Component} from "react";

export default class BatteryStatus extends Component<{ onChange: (status: { batteryLevel: number; charging: boolean }) => any },
  { supported: boolean; level: number; charging: false }> {
  private batteryManager: any;

  constructor(props: Readonly<{ onChange: (status: { batteryLevel: number; charging: boolean }) => any }>) {
    super(props);
    this.state = {supported: "getBattery" in navigator, level: 0, charging: false};
  }

  async componentDidMount() {
    if (this.state.supported) {
      // @ts-ignore
      this.batteryManager = await navigator.getBattery();
      this.batteryManager.addEventListener("levelchange", this.update);
      this.batteryManager.addEventListener("chargingchange", this.update);
      this.update();
    }
  }

  componentWillUnmount() {
    this.batteryManager.removeEventListener("levelchange", this.update);
    this.batteryManager.removeEventListener("chargingchange", this.update);
  }

  update = () => {
    this.props.onChange({batteryLevel: this.batteryManager.level, charging: this.batteryManager.charging});
    this.setState({level: this.batteryManager.level, charging: this.batteryManager.charging});
  };

  render() {
    if (this.state.supported) {
      const classes = ["slide battery"];
      if (this.state.charging) {
        classes.push("charging");
      }
      return <div className={classes.join(" ")}>{this.state.level * 100} % remaining</div>;
    }
    return <div>Your browser does not support the Battery Status API (anymore).</div>;
  }
}
