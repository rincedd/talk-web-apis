import React, { Component } from "react";
import { CodePane, FlexBox, Heading } from "spectacle";
// @ts-ignore
import prismTheme from "prism-react-renderer/themes/nightOwlLight";

import { ClientManager } from "./client-manager";
import { LeafletMap } from "./leaflet-map";

export default class GeolocationSlide extends Component<{
  clientManager: ClientManager;
}> {
  componentDidMount() {
    this.props.clientManager.switchClients("geolocation");
  }

  render() {
    return (
      <div>
        <Heading size={3}>geolocation API</Heading>
        <FlexBox alignItems="stretch" justifyContent="space-around">
          <LeafletMap clientManager={this.props.clientManager} />
          <CodePane autoFillHeight fontSize={16} language="javascript" theme={prismTheme}>{`// only allowed on HTTPS pages
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
      </div>
    );
  }
}
