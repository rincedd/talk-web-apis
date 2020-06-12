import React, {Component} from 'react';
import {Heading} from 'spectacle';
import {ClientManager} from "./client-manager";

export default class SpeechSynthesisSlide extends Component<{clientManager: ClientManager}> {
  private input: HTMLInputElement | null = null;
  componentDidMount() {
    this.props.clientManager.switchClients('speech');
  }

  _onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!this.input) {
      return;
    }
    e.preventDefault();
    this.props.clientManager.triggerSpeech(this.input.value);
  }

  render() {
    return <div>
      <Heading lineHeight={1.1} size={3}>speech synthesis API</Heading>
      <form onSubmit={e => this._onFormSubmit(e)}>
        <input type="text" ref={i => this.input = i} />
        <button type="submit">Say it</button>
      </form>
    </div>;
  }
}
