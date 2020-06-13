import React, { Component } from "react";
import { ClientManager } from "./client-manager";
import { Map as LMap, Marker, Popup, TileLayer } from "react-leaflet";
import "@skyraptor/leaflet.bouncemarker";

interface Position {
  lat: number;
  lng: number;
}

interface MarkerData extends Position {
  id: string;
}

const POS_TNG = { lat: 48.1861268, lng: 11.6548477 };
const POS_WERK3 = { lat: 48.124895, lng: 11.6036303 };

export class LeafletMap extends Component<{ bounceMarkers?: boolean; clientManager: ClientManager }, { markers: MarkerData[] }> {
  static defaultProps = {
    bounceMarkers: true,
  };

  private updateMarkers = () => {
    this.setState({
      markers: this.props.clientManager
        .getClients()
        .filter((c) => c.latitude && c.longitude)
        .map(
          (c): MarkerData => ({
            id: c.id,
            // @ts-ignore
            lat: c.latitude,
            // @ts-ignore
            lng: c.longitude,
          })
        ),
    });
  };

  constructor(props: Readonly<{ bounceMarkers: boolean; clientManager: ClientManager }>) {
    super(props);
    this.state = { markers: [] };
    global.L.Marker.mergeOptions({ bouncemarker: this.props.bounceMarkers });
  }

  componentDidMount() {
    this.props.clientManager.on("update", this.updateMarkers);
  }

  componentWillUnmount() {
    this.props.clientManager.removeListener("update", this.updateMarkers);
  }

  render() {
    const center = POS_WERK3;
    const zoom = 13;
    return (
      <LMap center={center} zoom={zoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={POS_TNG}>
          <Popup>TNG Technology Consulting GmbH</Popup>
        </Marker>
        <Marker position={POS_WERK3}>
          <Popup>Allianz Direct</Popup>
        </Marker>
        {this.state.markers.map((m: MarkerData) => (
          <Marker key={m.id} position={m} />
        ))}
      </LMap>
    );
  }
}
