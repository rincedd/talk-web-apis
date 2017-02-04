import React, { Component } from 'react';
import { Slide, Heading } from 'spectacle';

export default class SpeechSynthesisSlide extends Component {
  componentDidMount() {
    this.props.clientManager.switchClients('speech');
  }

  _onFormSubmit(e) {
    e.preventDefault();
    this.props.clientManager.triggerSpeech(this._input.value);
  }

  render() {
    return <Slide>
      <Heading lineHeight={1.1} size={3}>Speech Synthesis API</Heading>
      <form onSubmit={e => this._onFormSubmit(e)}>
        <input type="text" ref={i => this._input = i} />
        <button type="submit">Say it</button>
      </form>
    </Slide>;
  }
}
