import React, { Component } from 'react';

export default class SpeechSynthesis extends Component {
  constructor(props) {
    super(props);
    this.state = { voice: {} };
    this._boundLoadVoice = this._loadVoice.bind(this);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.addEventListener('voiceschanged', this._boundLoadVoice);
      this._loadVoice();
    }
  }

  _loadVoice() {
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.filter(v => v.lang.startsWith('en'))[0] || voices[0];
    this.setState({ voice });
  };

  componentWillUnmount() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.removeEventListener('voiceschanged', this._boundLoadVoice);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.text !== nextProps.text || this.state.voice.voiceURI !== nextState.voice.voiceURI;
  }

  componentDidUpdate() {
    this.speak();
  }

  speak() {
    const voice = this.state.voice;
    if (voice) {
      const utterance = new SpeechSynthesisUtterance(this.props.text);
      utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  }

  render() {
    if ('speechSynthesis' in window) {
      return <div className="slide speech">Your browser can talk to you! (Using {this.state.voice.voiceURI}.)</div>;
    }
    return <div>Speech synthesis API is not supported in your browser.</div>
  }
}
