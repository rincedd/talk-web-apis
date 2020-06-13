import React, {Component} from 'react';
import {Box, CodePane, FlexBox, Heading, Text} from 'spectacle';
// @ts-ignore
import prismTheme from "prism-react-renderer/themes/nightOwlLight";

import {ClientManager} from "./client-manager";

const example = `navigator.mediaDevices.getUserMedia({
    audio: true,  // more complex capability requests possible 
    video: true 
  })
  .then(stream => {
    const video = document.querySelector('video');
    video.src = URL.createObjectURL(stream);
    video.onloadedmetadata = () => video.play();
  })
  .catch(err => {
    console.error('error', err);
  });`;

export default class UserMediaSlide extends Component<{clientManager: ClientManager}, {supported: boolean}> {
  private stream: MediaStream | null = null;
  private video: HTMLVideoElement | null = null;
  constructor(props: Readonly<{ clientManager: ClientManager; }>) {
    super(props);
    this.state = { supported: Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) };
  }

  componentDidMount() {
    this.props.clientManager.switchClients('webrtc');
    // if (this.state.supported) {
    //   navigator.mediaDevices.getUserMedia({ audio: false, video: true })
    //     .then(stream => {
    //       this.stream = stream;
    //       this.props.clientManager.streamToClients(this.stream);
    //       this.video.src = URL.createObjectURL(stream);
    //       this.video.onloadedmetadata = () => this.video && this.video.play();
    //     })
    //     .catch(() => this.setState({ supported: false }));
    // }
  }

  componentWillUnmount() {
    this.video?.pause();
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = null;
    if (this.video) {
      URL.revokeObjectURL(this.video.src);
    }
  }

  render() {
    return <div>
      <Heading size={3}>user media streams</Heading>
      <Text margin="0 0 10px 0">(and WebRTC)</Text>
      <FlexBox>
        <Box>{this.state.supported ? <video width="400" ref={v => this.video = v} /> :
          <div>not supported/permitted</div>}</Box>
        <CodePane autoFillHeight language="javascript" theme={prismTheme}>{example}</CodePane>
      </FlexBox>
    </div>;
  }
}
