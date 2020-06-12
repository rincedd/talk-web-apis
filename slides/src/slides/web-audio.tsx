import React, {Component} from 'react';
import {CodePane, Box, Heading, Image, FlexBox} from 'spectacle';

export default class WebAudioSlide extends Component<{}, {playing: boolean}> {
  private ctx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {playing: false};
  }

  _play() {
    this.setState({playing: true});
    this.ctx = new AudioContext();

    this.oscillator = this.ctx.createOscillator();
    this.oscillator.type = 'sine';
    this.oscillator.frequency.value = 440;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 2;

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    this.oscillator.start();
  }

  _pause() {
    this.oscillator?.stop();
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
    this.oscillator = null;
    this.ctx = null;
  }

  render() {
    return (
    <div>
      <Heading size={3}>WebAudio</Heading>
      <Image src="https://mdn.mozillademos.org/files/12241/webaudioAPI_en.svg"/>
      <FlexBox>
        <Box>
          <button style={{marginTop: '2rem'}} onClick={() => this.handlePlayClick()}>{this.state.playing ? 'Pause' : 'Play'}</button>
        </Box>
        <Box>
          <CodePane language="javascript" autoFillHeight>{`
const ctx = new AudioContext();

const oscillator = ctx.createOscillator();
oscillator.type = 'sine';
oscillator.frequency.value = 440;

const gainNode = ctx.createGain();
gainNode.gain.value = 2;

oscillator.connect(gainNode);
gainNode.connect(ctx.destination);

oscillator.start();
          `}</CodePane>
        </Box>
      </FlexBox>
    </div>
    );
  }
}
