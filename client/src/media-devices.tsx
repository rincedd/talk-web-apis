import React, {Component} from "react";
import {MediaDeviceChoice} from "./media-device-choice";

export default class MediaDevices extends Component<{}, { supported: boolean; selectedVideoDeviceId?: string; error?: string }> {
  private video: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;
  private objUrl?: string;

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {supported: Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)};
  }

  private setMediaSrc(el: HTMLMediaElement) {
    try {
      if (this.objUrl) {
        URL.revokeObjectURL(this.objUrl);
      }
      this.objUrl = URL.createObjectURL(this.stream);
    } catch (e) {
      console.log("Browser does not accept MediaStream in createObjectURL()");
    }

    if (this.objUrl) {
      el.src = this.objUrl;
    } else {
      el.srcObject = this.stream;
    }
  }

  async componentDidMount() {
    await this.restartVideo();
  }

  private async restartVideo() {
    if (this.state.supported) {
      this.stop();
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            width: {ideal: 1280},
            height: {ideal: 720},
            deviceId: this.state.selectedVideoDeviceId
          },
        });
        if (this.video) {
          this.setMediaSrc(this.video);
          this.video.onloadedmetadata = () => this.video?.play();
        }
      } catch (e) {
        this.setState({error: e.message});
      }
    }
  }

  private stop() {
    this.video?.pause();
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = null;
  }

  componentWillUnmount() {
    this.stop();
    if (this.objUrl) {
      URL.revokeObjectURL(this.objUrl);
    }
  }

  togglePlayback = () => {
    if (this.video?.paused) {
      this.video.play();
    } else {
      this.video?.pause();
    }
  }

  render() {
    return (
      <div className="slide media-devices">
        <div>MediaDevices API</div>
        <div>
          <MediaDeviceChoice
            onChange={(deviceId) => this.setState({ selectedVideoDeviceId: deviceId }, () => this.restartVideo())}
            videoIn
            audioOut={false}
            audioIn={false}
          />
        </div>
        {this.state.error && <div className="error">{this.state.error}</div>}
        <video onClick={() => this.togglePlayback()} controls={false} width="600" ref={(v) => (this.video = v)} />
      </div>
    );
  }
}
