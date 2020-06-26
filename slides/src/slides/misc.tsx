import React, { Component } from "react";
import { Heading } from "spectacle";
import { ClientManager } from "./client-manager";

export default class MiscSlide extends Component<{ clientManager: ClientManager }> {
  componentDidMount() {
    this.props.clientManager.switchClients("sensors");
  }

  render() {
    return (
      <>
        <Heading>device feedback/sensors</Heading>
        <div style={{ margin: "0 auto" }}>
          <button className="btn" onClick={() => this.props.clientManager.triggerVibrate()}>
            Vibrate!
          </button>
        </div>
      </>
    );
  }
}
