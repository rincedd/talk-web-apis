import React, { Component } from 'react';
import { CodePane, Heading, Layout, Fit, Fill } from 'spectacle';

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

export default class UserMediaSlide extends Component {
  constructor(props) {
    super(props);
    this.state = { supported: navigator.mediaDevices && navigator.mediaDevices.getUserMedia };
    this._stream = null;
  }

  componentDidMount() {
    if (this.state.supported) {
      navigator.mediaDevices.getUserMedia({ audio: false, video: true })
        .then(stream => {
          this._stream = stream;
          this._video.src = URL.createObjectURL(stream);
          this._video.onloadedmetadata = () => this._video.play();
        })
        .catch(() => this.setState({ supported: false }));
    }
  }

  componentWillUnmount() {
    this._video.pause();
    this._stream.getTracks().forEach(track => track.stop());
    this._stream = null;
  }

  render() {
    return <div>
      <Heading size={3}>user media streams</Heading>
      <Layout>
        <Fit>{this.state.supported ? <video width="400" ref={v => this._video = v} /> :
          <div>not supported/permitted</div>}</Fit>
        <Fill>
          <CodePane textSize="1rem" margin="0 0.25rem" lang="javascript" source={example} />
        </Fill>
      </Layout>
    </div>;
  }
}
