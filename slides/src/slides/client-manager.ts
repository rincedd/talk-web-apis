import {EventEmitter} from 'events';
import {v4} from 'uuid';

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
    private _sessionId: string = v4();
    // private rtcInitiator: Instance;

    get sessionId(): string {
        return this._sessionId;
    }

    constructor() {
        super();
        this.initSessionId();

        this.faye = new Faye.Client(FAYE_URL, {timeout: 45});
        this.clientsById = new Map();
        this.currentPage = '';
        this.subscribe('connect', client => this._updateClient(client));
        this.subscribe('disconnect', client => this._removeClient(client));
        this.subscribe('update/*', client => this._updateClient(client));
        // this.subscribe('signal', ({signal, id}) => {
        //     if (id) {
        //         this.rtcInitiator && this.rtcInitiator.signal(signal);
        //     }
        // });
        setInterval(() => this.publish('heartbeat', {page: this.currentPage}), 2000);
    }

    private initSessionId() {
        const storedSessionId = sessionStorage.getItem('serverSessionId');
        if (storedSessionId) {
            this._sessionId = storedSessionId;
        } else {
            this._sessionId = v4();
            sessionStorage.setItem('serverSessionId', this._sessionId);
        }
    }

    private publish(channel: string, message: any) {
        return this.faye.publish(`/${this._sessionId}/${channel}`, message);
    }

    private subscribe(channel: string, cb: (message: any) => void) {
        return this.faye.subscribe(`/${this._sessionId}/channel`, cb);
    }

    switchClients(page: string) {
        this.currentPage = page;
        this.publish('switch', {page});
    }

    getClients(): Client[] {
        return Array.from(this.clientsById.values());
    }

    triggerSpeech(text: string) {
        this.publish('speech', {text});
    }

    triggerVibrate(pattern?: number[]) {
        this.publish('vibrate', {pattern});
    }

    /*
    streamToClients(stream) {
      this.rtcInitiator = new Peer({ initiator: true, stream });
      this.rtcInitiator.on('error', err => console.error('WebRTC error', err));
      this.rtcInitiator.on('signal', signal => this.publish('signal', { signal }));
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
