import React, { Component, PropTypes } from 'react';
import { Image, CodePane, Heading } from 'spectacle';

export default class WebAudioSlide extends Component {
  static propTypes = {
    clientManager: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.clientManager.switchClients('webaudio');
  }

  render() {
    return <div>
      <Heading size={3}>WebAudio</Heading>
      <Image src="https://mdn.mozillademos.org/files/12241/webaudioAPI_en.svg" />
      <CodePane lang="javascript" textSize="1rem" source="const ctx = new AudioContext();" />
    </div>;
  }
}
