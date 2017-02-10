import React, {Component} from 'react';
import Peer from 'simple-peer';

export default class VideoStream extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.rtcPeer = new Peer();
    this.rtcPeer.on('signal', signal => this.props.pubSubClient.publish('/signal', {
      signal,
      id: this.props.pubSubId
    }));
    this.rtcPeer.on('error', error => this.setState({ error }));
    this.rtcPeer.on('stream', stream => {
      if (this._video) {
        this._video.src = URL.createObjectURL(stream);
        this._video.onloadedmetadata = () => this._video && this._video.play();
      }
    });
    this.signalSubscription = this.props.pubSubClient.subscribe('/signal', ({ signal, id }) => {
      if (!id) {
        this.rtcPeer && !this.rtcPeer.destroyed && this.rtcPeer.signal(signal)
      }
    });
  }

  componentWillUnmount() {
    this._video.pause();
    URL.revokeObjectURL(this._video.src);
    this.signalSubscription.cancel();
    this.rtcPeer.destroy(() => this.rtcPeer = null);
  }

  render() {
    return (
      <div className="slide webrtc">
        <div>WebRTC {Peer.WEBRTC_SUPPORT ? 'supported' : 'not supported'}</div>
        { this.state.error ? <div className="error">WebRTC error</div> : null }
        <video width="600" ref={v => this._video = v} />
      </div>
    );
  }
}
