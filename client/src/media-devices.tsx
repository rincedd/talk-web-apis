import React, { Component } from "react";
import { MediaDeviceChoice } from "./media-device-choice";

export default class MediaDevices extends Component<{}, { supported: boolean; selectedVideoDeviceId?: string; error?: string }> {
  private video: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;
  private objUrl?: string;

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = { supported: Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) };
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
    if (this.state.supported) {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
        });
        if (this.video) {
          this.video.pause();
          this.setMediaSrc(this.video);
          this.video.onloadedmetadata = () => this.video?.play();
        }
      } catch (e) {
        this.setState({ error: e.message });
      }
    }
  }

  componentWillUnmount() {
    this.video?.pause();
    if (this.objUrl) {
      URL.revokeObjectURL(this.objUrl);
    }
    this.stream = null;
  }

  async switchDevice() {
    try {
      const videoTracks = this.stream?.getVideoTracks();
      if (videoTracks) {
        for (let track of videoTracks) {
          await track.applyConstraints({ deviceId: this.state.selectedVideoDeviceId });
        }
      }
    } catch (e) {
      this.setState({ error: `Failed to switch device [${e.message}]` });
    }
  }

  render() {
    return (
      <div className="slide media-devices">
        <div>MediaDevices API</div>
        <div>
          <MediaDeviceChoice
            onChange={(deviceId) => this.setState({ selectedVideoDeviceId: deviceId }, () => this.switchDevice())}
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
