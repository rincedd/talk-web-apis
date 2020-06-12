import React, { Component } from 'react';
import { CodePane, Box, FlexBox, Heading } from 'spectacle';
import {ClientManager} from "./client-manager";

declare var google: any;

const MAPS_API_KEY = process.env.npm_config_google_api_key;
const CALLBACK_NAME = '__gmInitMap';

export default class GeolocationSlide extends Component<{clientManager: ClientManager}, {ready: boolean, markers: Map<any, any>}> {
  private googleMapsScript?: HTMLScriptElement;
  private clientManagerUpdateHandler = () => this._updateMarkers();
  private el: HTMLDivElement | null = null;
  private map: any;
  constructor(props: Readonly<{ clientManager: ClientManager; }>) {
    super(props);
    this.state = { ready: false, markers: new Map() };
  }

  componentDidMount() {
    // @ts-ignore
    window[CALLBACK_NAME] = () => this._initMap();
    this.googleMapsScript = document.createElement('script');
    this.googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&callback=${CALLBACK_NAME}`;
    document.querySelector('body')?.appendChild(this.googleMapsScript);

    this.props.clientManager.switchClients('geolocation');
    this.props.clientManager.on('update', this.clientManagerUpdateHandler);
  }

  componentWillUnmount() {
    // @ts-ignore
    delete window[CALLBACK_NAME];
    this.googleMapsScript?.parentNode?.removeChild(this.googleMapsScript);
    this.props.clientManager.removeListener('update', this.clientManagerUpdateHandler)
  }

  _initMap() {
    this.map = new google.maps.Map(this.el, {
      center: { lat: 48.1861268, lng: 11.6548477 },
      zoom: 17
    });
    this.setState({ ready: true });
  }

  _updateMarkers() {
    if (!this.state.ready) {
      return;
    }
    this.props.clientManager.getClients().forEach((client, index) => {
      if ('latitude' in client && 'longitude' in client) {
        if (!this.state.markers.has(client)) {
          this.state.markers.set(client, new google.maps.Marker({
            map: this.map,
            position: { lat: client.latitude, lng: client.longitude },
            animation: google.maps.Animation.DROP,
            label: String(index + 1)
          }));
        } else {
          this.state.markers.get(client).setPosition({ lat: client.latitude, lng: client.longitude });
        }
      }
    });
  }

  render() {
    return <div>
      <Heading size={3}>geolocation API</Heading>
      <FlexBox>
        <Box>
          <div style={{ height: '400px' }} ref={el => this.el = el} />
        </Box>
        <CodePane autoFillHeight language="javascript">{`
// only allowed on HTTPS pages
navigator.geolocation.getCurrentPosition(
  p => {
    console.log(p.coords.latitude, p.coords.longitude);
  },
  error => {
    console.error('Some error', error);
  },
  {
    enableHighAccuracy: true
  }
);

const watchId = navigator.geolocation.watchPosition(
  p => {
    console.log('new position', p.coords);
  },
  error => console.error(error)
);

navigator.geolocation.clearWatch(watchId);
        `}</CodePane>
      </FlexBox>
    </div>;
  }
}
