import React, {Component} from "react";

export default class SpeechSynthesis extends Component<{ text: string }, { voice: SpeechSynthesisVoice | null; supported: boolean }> {
  constructor(props: Readonly<{ text: string }>) {
    super(props);
    this.state = {voice: null, supported: "speechSynthesis" in window};
  }

  loadVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const voice = voices.filter((v) => v.lang.startsWith("en"))[0] || voices[0];
      this.setState({voice});
    } else {
      this.setState({voice: null});
    }
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
    nextProps: Readonly<{ text: string }>,
    nextState: Readonly<{ voice: SpeechSynthesisVoice | null; supported: boolean }>,
    nextContext: any
  ): boolean {
    return Boolean(this.props.text !== nextProps.text || (this.state.voice && this.state.voice.voiceURI !== nextState.voice?.voiceURI));
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
    if (this.state.supported) {
      return (
        <div className="slide speech">
          Your browser can talk to you! {this.state.voice ? `Using ${this.state.voice.voiceURI}.` : "But there are no available voices :("}
        </div>
      );
    }
    return <div>Speech synthesis API is not supported in your browser.</div>;
  }
}
