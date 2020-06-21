import React, {Component} from "react";

export default class SpeechSynthesis extends Component<{ text: string },
  { voices: SpeechSynthesisVoice[]; selectedVoice: SpeechSynthesisVoice | null; supported: boolean }> {
  constructor(props: Readonly<{ text: string }>) {
    super(props);
    this.state = {selectedVoice: null, voices: [], supported: "speechSynthesis" in window};
  }

  private loadVoice = () => {
    this.setState({voices: window.speechSynthesis.getVoices(), selectedVoice: null});
  };

  componentDidMount() {
    if (this.state.supported) {
      window.speechSynthesis.addEventListener("voiceschanged", this.loadVoice);
      this.loadVoice();
    }
  }

  componentWillUnmount() {
    if (this.state.supported) {
      window.speechSynthesis.removeEventListener("voiceschanged", this.loadVoice);
    }
  }

  shouldComponentUpdate(
    nextProps: { text: string },
    nextState: { selectedVoice: SpeechSynthesisVoice | null; voices: SpeechSynthesisVoice[]; supported: boolean },
    nextContext: any
  ): boolean {
    return Boolean(
      this.props.text !== nextProps.text ||
      (this.state.selectedVoice && this.state.selectedVoice.voiceURI !== nextState.selectedVoice?.voiceURI) ||
      this.state.voices !== nextState.voices
    );
  }

  componentDidUpdate() {
    this.speak();
  }

  speak() {
    const voice = this.state.selectedVoice;
    if (voice) {
      const utterance = new SpeechSynthesisUtterance(this.props.text);
      utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  }

  render() {
    if (this.state.supported) {
      return (
        <div className="slide speech">
          Your browser can talk to you!
          {this.state.voices.map((v) => (
            <div key={v.voiceURI}>
              <input
                type="radio"
                name="voice"
                value={v.voiceURI}
                checked={v === this.state.selectedVoice}
                onChange={(e) => this.setState({selectedVoice: this.state.voices.find((x) => x.voiceURI === v.voiceURI) || null})}
              />
            </div>
          ))}
        </div>
      );
    }
    return <div>Speech synthesis API is not supported in your browser.</div>;
  }
}
