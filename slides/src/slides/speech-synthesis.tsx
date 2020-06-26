import React, {Component} from 'react';
import {CodePane, Heading} from 'spectacle';
import {ClientManager} from "./client-manager";
// @ts-ignore
import prismTheme from "prism-react-renderer/themes/nightOwlLight";

const example = `const voices = window.speechSynthesis.getVoices();
const utterance = new SpeechSynthesisUtterance('Hi there!');
utterance.voice = voices[0];

window.speechSynthesis.speak(utterance);
`;

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
    return <>
      <Heading>speech synthesis API</Heading>
      <CodePane autoFillHeight language="javascript" indentSize={4} theme={prismTheme}>{example}</CodePane>
      <form style={{margin: "20px 0"}} onSubmit={e => this._onFormSubmit(e)}>
        <input style={{width: "50%"}} placeholder="e.g., hello world!" type="text" ref={i => this.input = i} />
        <button type="submit">Say it</button>
      </form>
    </>;
  }
}
