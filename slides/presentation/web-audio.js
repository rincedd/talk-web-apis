import React, {Component, PropTypes} from 'react';
import {Image, CodePane, Heading, Layout, Fill} from 'spectacle';

export default class WebAudioSlide extends Component {
  constructor(props) {
    super(props);
    this.state = {playing: false};
  }

  _play() {
    this.setState({playing: true});
    this._ctx = new AudioContext();

    this._oscillator = this._ctx.createOscillator();
    this._oscillator.type = 'sine';
    this._oscillator.frequency.value = 440;

    this._gainNode = this._ctx.createGain();
    this._gainNode.gain.value = 2;

    this._oscillator.connect(this._gainNode);
    this._gainNode.connect(this._ctx.destination);

    this._oscillator.start();
  }

  _pause() {
    this._oscillator.stop();
    this.setState({playing: false});
  }

  handlePlayClick() {
    if (this.state.playing) {
      this._pause();
    } else {
      this._play();
    }
  }

  componentWillUnmount() {
    this._pause();
    this._oscillator = null;
    this._ctx = null;
  }

  render() {
    return (
    <div>
      <Heading size={3}>WebAudio</Heading>
      <Image src="https://mdn.mozillademos.org/files/12241/webaudioAPI_en.svg"/>
      <Layout>
        <Fill>
          <button style={{marginTop: '2rem'}} onClick={() => this.handlePlayClick()}>{this.state.playing ? 'Pause' : 'Play'}</button>
        </Fill>
        <Fill>
          <CodePane lang="javascript" textSize="1rem" source={require('raw-loader!./web-audio.sample')}/>
        </Fill>
      </Layout>
    </div>
    );
  }
}
