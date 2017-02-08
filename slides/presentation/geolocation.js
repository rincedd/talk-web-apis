import React, { Component, PropTypes } from 'react';
import { CodePane, Fill, Fit, Layout, Heading } from 'spectacle';

const MAPS_API_KEY = process.env.npm_config_google_api_key;
const CALLBACK_NAME = '__gmInitMap';

export default class GeolocationSlide extends Component {
  static propTypes = {
    clientManager: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { ready: false, markers: new Map() };
  }

  componentDidMount() {
    window[CALLBACK_NAME] = () => this._initMap();
    this.googleMapsScript = document.createElement('script');
    this.googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&callback=${CALLBACK_NAME}`;
    document.querySelector('body').appendChild(this.googleMapsScript);

    this.props.clientManager.switchClients('geolocation');
    this._clientManagerUpdateHandler = () => this._updateMarkers();
    this.props.clientManager.on('update', this._clientManagerUpdateHandler);
  }

  componentWillUnmount() {
    delete window[CALLBACK_NAME];
    this.googleMapsScript.parentNode.removeChild(this.googleMapsScript);
    this.props.clientManager.removeListener('update', this._clientManagerUpdateHandler)
  }

  _initMap() {
    this._map = new google.maps.Map(this._el, {
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
            map: this._map,
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
      <Heading size={3}>Geolocation API</Heading>
      <Layout>
        <Fill>
          <div style={{ height: '400px' }} ref={el => this._el = el} />
        </Fill>
        <Fit>
          <CodePane lang="javascript" source={require('raw-loader!./geolocation.sample')} />
        </Fit>
      </Layout>
    </div>;
  }
}
