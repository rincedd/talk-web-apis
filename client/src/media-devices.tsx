import React, {Component} from "react";

const DEVICE_TYPE_SYMBOLS = {
  audioinput: "🎤",
  audiooutput: "🔈",
  videoinput: "🎥",
};

export default class MediaDevices extends Component<{}, { devices: MediaDeviceInfo[]; error?: string }> {
  private video: HTMLVideoElement | null = null;
  private objUrl?: string;

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {devices: []};
  }

  private setMediaSrc(el: HTMLMediaElement, srcStream: MediaStream) {
    try {
      this.objUrl = URL.createObjectURL(srcStream);
    } catch (e) {
      console.log("Browser does not accept MediaStream in createObjectURL()");
    }

    if (this.objUrl) {
      el.src = this.objUrl;
    } else {
      el.srcObject = srcStream;
    }
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
        this.setMediaSrc(this.video, stream);
        this.video.onloadedmetadata = () => this.video?.play();
      }
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.setState({ devices });
    } catch (e) {
      this.setState({ error: e.message });
    }
  }

  componentWillUnmount() {
    this.video?.pause();
    if (this.objUrl) {
      URL.revokeObjectURL(this.objUrl);
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
