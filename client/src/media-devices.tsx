import React, {Component} from "react";

const DEVICE_TYPE_SYMBOLS = {
  audioinput: "🎤",
  audiooutput: "🔈",
  videoinput: "🎥",
};

export default class MediaDevices extends Component<{}, { devices: MediaDeviceInfo[]; error?: string }> {
  private video: HTMLVideoElement | null = null;

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {devices: []};
  }

  async componentDidMount() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          width: {ideal: 1280},
          height: {ideal: 720},
          facingMode: "user",
        },
      });
      if (this.video) {
        this.video.src = URL.createObjectURL(stream);
        this.video.onloadedmetadata = () => this.video?.play();
      }
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.setState({ devices });
    } catch (e) {
      this.setState({ error: e.message });
    }
  }

  componentWillUnmount() {
    if (this.video) {
      this.video.pause();
      URL.revokeObjectURL(this.video.src);
    }
  }

  render() {
    return (
      <div className="slide media-devices">
        <div>
          MediaDevices API
          <ul>
            {this.state.devices.map((d) => (
              <li>
                {DEVICE_TYPE_SYMBOLS[d.kind]} {d.label || d.deviceId}
              </li>
            ))}
          </ul>
        </div>
        {this.state.error && <div className="error">{this.state.error}</div>}
        <video width="600" ref={(v) => (this.video = v)} />
      </div>
    );
  }
}
