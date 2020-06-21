import React, {Component} from "react";
import {MediaDeviceChoice} from "./media-device-choice";

const DEVICE_TYPE_SYMBOLS = {
  audioinput: "🎤",
  audiooutput: "🔈",
  videoinput: "🎥",
};

export default class MediaDevices extends Component<{}, { supported: boolean; selectedVideoDeviceId?: string; error?: string }> {
  private video: HTMLVideoElement | null = null;
  private objUrl?: string;

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {supported: Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)};
  }

  private setMediaSrc(el: HTMLMediaElement, srcStream: MediaStream) {
    try {
      if (this.objUrl) {
        URL.revokeObjectURL(this.objUrl);
      }
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

  componentDidMount() {
    this.startVideoStream();
  }

  private async startVideoStream() {
    if (this.state.supported) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            width: {ideal: 1280},
            height: {ideal: 720},
            deviceId: this.state.selectedVideoDeviceId,
          },
        });
        if (this.video) {
          this.video.pause();
          this.setMediaSrc(this.video, stream);
          this.video.onloadedmetadata = () => this.video?.play();
        }
      } catch (e) {
        this.setState({error: e.message});
      }
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
        <div>MediaDevices API</div>
        <div>
          <MediaDeviceChoice
            onChange={(deviceId) => this.setState({selectedVideoDeviceId: deviceId})}
            videoIn
            audioOut={false}
            audioIn={false}
          />
        </div>
        {this.state.error && <div className="error">{this.state.error}</div>}
        <video width="600" ref={(v) => (this.video = v)} />
      </div>
    );
  }
}
