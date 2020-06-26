import React, { Component } from "react";
import { FlexBox, Image } from "spectacle";
import { ClientManager } from "./client-manager";

export default class CrowsSlide extends Component<{ clientManager: ClientManager }> {
  componentDidMount() {
    this.props.clientManager.switchClients("webaudio");
  }

  render() {
    return (
      <FlexBox height="100%" justifyContent="space-around" alignItems="center">
        <Image src={require("../assets/web-audio-crow.svg")} />
      </FlexBox>
    );
  }
}
