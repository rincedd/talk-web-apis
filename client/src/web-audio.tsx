import React, { Component } from "react";

const AUDIO_FILE = "/client/XC348301.mp3";

export default class WebAudio extends Component<{}, { supported: boolean; error?: string }> {
  private audioCtx?: AudioContext;
  private source?: AudioBufferSourceNode;
  private analyser?: AnalyserNode;
  private canvas: HTMLCanvasElement | null = null;
  private animationFrame?: number;

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = { supported: "AudioContext" in window || "webkitAudioContext" in window };
  }

  componentDidMount() {
    if (!this.state.supported) {
      return;
    }
    // TODO need user interaction before audio context is allowed to start
    // @ts-ignore
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.source = this.audioCtx.createBufferSource();
    this.analyser = this.audioCtx.createAnalyser();
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);
    this.analyser.fftSize = 2048;
    this.loadAudioData();
    this._startOscilloscope();
  }

  loadAudioData() {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", AUDIO_FILE, true);
    xhr.responseType = "arraybuffer";

    xhr.onload = () => {
      const audioData = xhr.response;

      this.audioCtx?.decodeAudioData(
        audioData,
        (buffer) => {
          if (this.source) {
            this.source.stop(0);
            this.source.buffer = buffer || null;
            this.source.loop = true;
            this.source.start(0);
          }
        },
        (err) => {
          this.setState({ error: `Error decoding audio data [${err.message}]` });
        }
      );
    };

    xhr.send();
  }

  _startOscilloscope() {
    if (!this.canvas || !this.analyser) {
      return;
    }

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteTimeDomainData(dataArray);

    const draw = () => {
      this.animationFrame = requestAnimationFrame(draw);
      if (!this.canvas || !this.analyser) {
        return;
      }

      const canvasCtx = this.canvas.getContext("2d");
      if (!canvasCtx) {
        return;
      }

      this.analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = "#300a76";
      canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "#eeeeee";

      canvasCtx.beginPath();

      const sliceWidth = (this.canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * this.canvas.height) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(this.canvas.width, this.canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();
  }

  componentWillUnmount() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    try {
      this.source?.stop(0);
      this.audioCtx?.close();
    } catch (e) {
      console.error(`Error during unmounting: ${e.message}`);
    }
  }

  render() {
    if (!this.state.supported) {
      return <div className="slide error">WebAudio is not supported in your browser.</div>;
    } else if (this.state.error) {
      return <div className="slide error">Error: {this.state.error}</div>;
    }
    return (
      <div className="slide webaudio">
        <div>WebAudio</div>
        <canvas width="600" height="300" ref={(c) => (this.canvas = c)} />
      </div>
    );
  }
}
