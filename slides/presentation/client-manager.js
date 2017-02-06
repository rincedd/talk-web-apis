import Faye from 'faye/src/faye_browser';
import { EventEmitter } from 'events';

const FAYE_URL = 'http://localhost:8000/faye';

export default class ClientManager extends EventEmitter {
  constructor() {
    super();
    this.faye = new Faye.Client(FAYE_URL, { timeout: 60 });
    this.clientsById = new Map();
    this.currentPage = '';
    this.faye.subscribe('/connect', client => this._updateClient(client));
    this.faye.subscribe('/disconnect', client => this._removeClient(client));
    this.faye.subscribe('/update/*', client => this._updateClient(client));
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
