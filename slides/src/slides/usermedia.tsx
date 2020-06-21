import React, {Component} from "react";
import {Box, CodePane, FlexBox, Heading} from "spectacle";
// @ts-ignore
import prismTheme from "prism-react-renderer/themes/nightOwlLight";

import {ClientManager} from "./client-manager";

const DEVICE_TYPE_SYMBOLS = {
  audioinput: "🎤",
  audiooutput: "🔈",
  videoinput: "🎥",
};

const example = `const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user'
  }
});
const video = document.querySelector('video');
video.srcObject = stream;
video.onloadedmetadata = () => video.play();
`;

export default class UserMediaSlide extends Component<{ clientManager: ClientManager },
  { devices: MediaDeviceInfo[]; error?: string; supported: boolean }> {
  private video: HTMLVideoElement | null = null;
  private objUrl?: string;

  constructor(props: Readonly<{ clientManager: ClientManager }>) {
    super(props);
    this.state = {
      devices: [],
      supported: Boolean(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices && navigator.mediaDevices.getUserMedia),
    };
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
    this.props.clientManager.switchClients("usermedia");
    if (this.state.supported) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            width: {ideal: 1280},
            height: {ideal: 720},
          },
        });
        if (this.video) {
          this.setMediaSrc(this.video, stream);
          this.video.onloadedmetadata = () => this.video && this.video.play();
        }
        const devices = await navigator.mediaDevices.enumerateDevices();
        this.setState({devices});
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
      <div>
        <Heading size={3}>user media streams</Heading>
        <FlexBox justifyContent="space-around">
          {this.state.supported ? (
            <Box width="20%">
              {this.state.error && <div className="error">{this.state.error}</div>}
              <video ref={(v) => (this.video = v)} />
              <div>
                <select>
                  {this.state.devices.map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {DEVICE_TYPE_SYMBOLS[d.kind]} {d.label || d.deviceId}
                    </option>
                  ))}
                </select>
              </div>
            </Box>
          ) : (
            <Box>not supported/permitted</Box>
          )}
          <Box width="70%">
            <CodePane autoFillHeight language="javascript" theme={prismTheme}>
              {example}
            </CodePane>
          </Box>
        </FlexBox>
      </div>
    );
  }
}
