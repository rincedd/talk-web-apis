import React, {Component} from "react";

const DEVICE_TYPE_SYMBOLS = {
  audioinput: "🎤",
  audiooutput: "🔈",
  videoinput: "🎥",
};

export class MediaDeviceChoice extends Component<{ audioIn: boolean; audioOut: boolean; videoIn: boolean; onChange: (deviceId: string) => any },
  { devices: MediaDeviceInfo[]; supported: boolean }> {
  static defaultProps = {audioIn: true, audioOut: false, videoIn: true};

  constructor(props: Readonly<{ audioIn: boolean; audioOut: boolean; videoIn: boolean; onChange: (deviceId: string) => any }>) {
    super(props);
    this.state = {
      devices: [],
      supported: Boolean(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices),
    };
  }

  componentDidMount() {
    if (this.state.supported) {
      navigator.mediaDevices.addEventListener("devicechange", this.updateList);
      this.updateList();
    }
  }

  componentWillUnmount() {
    if (this.state.supported) {
      navigator.mediaDevices.removeEventListener("devicechange", this.updateList);
    }
  }

  private updateList = async () => {
    this.setState({
      devices: (await navigator.mediaDevices.enumerateDevices()).filter(
        (d) =>
          (d.kind === "audioinput" && this.props.audioIn) ||
          (d.kind === "audiooutput" && this.props.audioOut) ||
          (d.kind === "videoinput" && this.props.videoIn)
      ),
    });
  };

  render() {
    if (!this.state.supported) {
      return <span>Enumerating media devices is not supported in your browser.</span>;
    }
    return (
      <select onChange={(e) => this.props.onChange(e.target.value)}>
        {this.state.devices.map((d, i) => (
          <option value={d.deviceId} key={d.deviceId || i}>
            {DEVICE_TYPE_SYMBOLS[d.kind]} {d.label}
          </option>
        ))}
      </select>
    );
  }
}
