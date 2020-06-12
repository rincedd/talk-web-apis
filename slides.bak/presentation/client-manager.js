import Faye from 'faye/src/faye_browser';
import {EventEmitter} from 'events';
import Peer from 'simple-peer';

const FAYE_URL = 'https://gzschaler.de/ws';

export default class ClientManager extends EventEmitter {
  constructor() {
    super();
    this.faye = new Faye.Client(FAYE_URL, {timeout: 45});
    this.clientsById = new Map();
    this.currentPage = '';
    this.faye.subscribe('/connect', client => this._updateClient(client));
    this.faye.subscribe('/disconnect', client => this._removeClient(client));
    this.faye.subscribe('/update/*', client => this._updateClient(client));
    this.faye.subscribe('/signal', ({ signal, id }) => {
      if (id) {
        this.rtcInitiator && this.rtcInitiator.signal(signal);
      }
    });
    setInterval(() => this.faye.publish('/heartbeat', { page: this.currentPage }), 2000);
  }

  switchClients(page) {
    this.currentPage = page;
    this.faye.publish('/switch', { page });
  }

  getClients() {
    return Array.from(this.clientsById.values());
  }

  triggerSpeech(text) {
    this.faye.publish('/speech', { text });
  }

  triggerVibrate(pattern) {
    this.faye.publish('/vibrate', { pattern });
  }

  streamToClients(stream) {
    this.rtcInitiator = new Peer({ initiator: true, stream });
    this.rtcInitiator.on('error', err => console.error('WebRTC error', err));
    this.rtcInitiator.on('signal', signal => this.faye.publish('/signal', { signal }));
  }

  stopStreaming() {
    this.rtcInitiator.destroy(() => this.rtcInitiator = null);
  }

  _updateClient(client) {
    if (this.clientsById.has(client.id)) {
      Object.assign(this.clientsById.get(client.id), client);
    } else {
      this.clientsById.set(client.id, client);
    }
    this.emit('update', this.clientsById.get(client.id));
  }

  _removeClient(client) {
    this.clientsById.delete(client.id);
  }
}
