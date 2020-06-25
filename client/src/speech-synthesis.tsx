import React, { Component } from "react";

export default class SpeechSynthesis extends Component<
  { text: string },
  { voices: SpeechSynthesisVoice[]; selectedVoice: SpeechSynthesisVoice | null; supported: boolean; speaking: boolean }
> {
  constructor(props: Readonly<{ text: string }>) {
    super(props);
    this.state = { selectedVoice: null, voices: [], supported: "speechSynthesis" in window, speaking: false };
  }

  private loadVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find((v) => v.default === true) || voices[0] || null;
    this.setState({ voices: voices, selectedVoice });
  };

  componentDidMount() {
    if (this.state.supported) {
      if ("addEventListener" in window.speechSynthesis) {
        window.speechSynthesis.addEventListener("voiceschanged", this.loadVoice);
      }
      this.loadVoice();
    }
  }

  componentWillUnmount() {
    if (this.state.supported && "addEventListener" in window.speechSynthesis) {
      window.speechSynthesis.removeEventListener("voiceschanged", this.loadVoice);
    }
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (
      this.props.text !== prevProps.text ||
      (this.state.selectedVoice && this.state.selectedVoice.voiceURI !== prevState.selectedVoice?.voiceURI) ||
      this.state.voices !== prevState.voices
    ) {
      this.speak();
    }
  }

  speak() {
    const voice = this.state.selectedVoice;
    if (voice) {
      const utterance = new SpeechSynthesisUtterance(this.props.text);
      utterance.voice = voice;

      utterance.onstart = () => this.setState({ speaking: true });
      utterance.onresume = () => this.setState({ speaking: true });
      utterance.onpause = () => this.setState({ speaking: false });
      utterance.onend = () => this.setState({ speaking: false });

      window.speechSynthesis.speak(utterance);
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }
  }

  render() {
    if (this.state.supported) {
      return (
        <div className="slide speech">
          Your browser can talk to you! [{this.state.speaking ? "speaking" : "paused"}]
          <select
            value={this.state.selectedVoice?.voiceURI}
            onChange={(e) => this.setState({ selectedVoice: this.state.voices.find((x) => x.voiceURI === e.target.value) || null })}
          >
            {this.state.voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} [{v.lang}]
              </option>
            ))}
          </select>
        </div>
      );
    }
    return <div>Speech synthesis API is not supported in your browser.</div>;
  }
}
