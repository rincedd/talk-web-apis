import React, { Component } from 'react';

const AUDIO_FILE = '/XC348301.mp3';

export default class WebAudio extends Component {
  constructor(props) {
    super(props);
    this.state = { supported: 'AudioContext' in window || 'webkitAudioContext' in window };
  }

  componentDidMount() {
    if (!this.state.supported) {
      return;
    }
    this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this._source = this._audioCtx.createBufferSource();
    this._analyser = this._audioCtx.createAnalyser();
    this._source.connect(this._analyser);
    this._analyser.connect(this._audioCtx.destination);
    this._analyser.fftSize = 2048;
    this._getAudioData();
    this._startOscilloscope();
    this._source.start(0);
  }

  _getAudioData() {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', AUDIO_FILE, true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = () => {
      const audioData = xhr.response;

      this._audioCtx.decodeAudioData(audioData)
        .then(buffer => {
          this._source.buffer = buffer;
          this._source.loop = true;
        })
        .catch(e => this.setState({ error: "Error with decoding audio data" + e.err }));
    };

    xhr.send();
  }

  _startOscilloscope() {
    const canvasCtx = this._canvas.getContext('2d');
    const bufferLength = this._analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this._analyser.getByteTimeDomainData(dataArray);

    const draw = () => {
      this._animationFrame = requestAnimationFrame(draw);

      this._analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = '#300a76';
      canvasCtx.fillRect(0, 0, this._canvas.width, this._canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = '#ececec';

      canvasCtx.beginPath();

      const sliceWidth = this._canvas.width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {

        const v = dataArray[i] / 128.0;
        const y = v * this._canvas.height / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(this._canvas.width, this._canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this._animationFrame);
    this._source.stop(0);
    this._audioCtx.close();
  }

  render() {
    if (!this.state.supported) {
      return <div className="slide error">WebAudio is not supported in your browser.</div>;
    } else if (this.state.error) {
      return <div className="slide error">Error: {this.state.error}</div>;
    }
    return <div className="slide webaudio">
      <div>WebAudio</div>
      <canvas width={400} height={400} ref={c => this._canvas = c} />
    </div>;
  }
}
