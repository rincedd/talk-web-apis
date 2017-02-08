import React, { Component, PropTypes } from 'react';
import { Heading } from 'spectacle';

export default class SpeechSynthesisSlide extends Component {
  static propTypes = {
    clientManager: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.clientManager.switchClients('speech');
  }

  _onFormSubmit(e) {
    e.preventDefault();
    this.props.clientManager.triggerSpeech(this._input.value);
  }

  render() {
    return <div>
      <Heading lineHeight={1.1} size={3}>speech synthesis API</Heading>
      <form onSubmit={e => this._onFormSubmit(e)}>
        <input type="text" ref={i => this._input = i} />
        <button type="submit">Say it</button>
      </form>
    </div>;
  }
}
