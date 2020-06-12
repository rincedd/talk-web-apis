import {EventEmitter} from 'events';

declare namespace Faye {
    export class Client {
        constructor(url: string, options?: any);
        publish(channel: string, message: any): Promise<void>;
        subscribe(channel: string, cb: ((message: any) => void)): Promise<void>;
    }
}

export interface Client {
    id: string;
    browser: object;
    batteryLevel?: any;
    charging?: boolean;
    latitude?: string;
    longitude?: string;
}

const FAYE_URL = 'https://gzschaler.de/ws';

export class ClientManager extends EventEmitter {
    private clientsById: Map<string, Client>;
    private currentPage: string;
    private faye: Faye.Client;
    // private rtcInitiator: Instance;

    constructor() {
        super();
        this.faye = new Faye.Client(FAYE_URL, {timeout: 45});
        this.clientsById = new Map();
        this.currentPage = '';
        this.faye.subscribe('/connect', client => this._updateClient(client));
        this.faye.subscribe('/disconnect', client => this._removeClient(client));
        this.faye.subscribe('/update/*', client => this._updateClient(client));
        // this.faye.subscribe('/signal', ({signal, id}) => {
        //     if (id) {
        //         this.rtcInitiator && this.rtcInitiator.signal(signal);
        //     }
        // });
        setInterval(() => this.faye.publish('/heartbeat', {page: this.currentPage}), 2000);
    }

    switchClients(page: string) {
        this.currentPage = page;
        this.faye.publish('/switch', {page});
    }

    getClients(): Client[] {
        return Array.from(this.clientsById.values());
    }

    triggerSpeech(text: string) {
        this.faye.publish('/speech', {text});
    }

    triggerVibrate(pattern?: number[]) {
        this.faye.publish('/vibrate', {pattern});
    }

    /*
    streamToClients(stream) {
      this.rtcInitiator = new Peer({ initiator: true, stream });
      this.rtcInitiator.on('error', err => console.error('WebRTC error', err));
      this.rtcInitiator.on('signal', signal => this.faye.publish('/signal', { signal }));
    }

    stopStreaming() {
      this.rtcInitiator.destroy(() => {this.rtcInitiator = null});
    }
  */
    _updateClient(client: Client) {
        if (this.clientsById.has(client.id)) {
            Object.assign(this.clientsById.get(client.id), client);
        } else {
            this.clientsById.set(client.id, client);
        }
        this.emit('update', this.clientsById.get(client.id));
    }

    _removeClient(client: Client) {
        this.clientsById.delete(client.id);
    }
}
