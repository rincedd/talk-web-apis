import Faye from 'faye/src/faye_browser';
import { EventEmitter } from 'events';

const FAYE_URL = 'http://localhost:8000/faye';

export default class ClientManager extends EventEmitter {
  constructor() {
    super();
    this.faye = new Faye.Client(FAYE_URL, { timeout: 60 });
    this.clientsById = new Map();
    this.faye.subscribe('/connect', client => this._updateClient(client));
    this.faye.subscribe('/disconnect', client => this._removeClient(client));
    this.faye.subscribe('/battery', client => this._updateClient(client))
  }

  switchClients(page) {
    this.faye.publish('/switch', { page });
  }

  getClients() {
    return Array.from(this.clientsById.values());
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
