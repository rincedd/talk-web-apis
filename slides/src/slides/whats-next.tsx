import React, { Component } from "react";
import { Heading, Link, ListItem, UnorderedList, Text } from "spectacle";
import { ClientManager } from "./client-manager";

export default class WhatsNextSlide extends Component<{ clientManager: ClientManager }> {
  componentDidMount() {
    this.props.clientManager.switchClients("thankyou");
  }

  render() {
    return (
      <>
        <Heading>and much more...</Heading>
        <UnorderedList margin="20px auto" style={{ width: "80%" }}>
          <ListItem>
            <Link href="https://devdocs.io/dom/webgl_api">WebGL</Link>3D rendering contexts
          </ListItem>
          <ListItem>
            <Link href="https://devdocs.io/dom/webrtc_api">WebRTC</Link>real-time peer-to-peer channels
          </ListItem>
          <ListItem>
            <Link href="https://googlechrome.github.io/samples/web-nfc/">WebNFC</Link>read NFC tags from the browser
          </ListItem>
          <ListItem>
            <Link href="https://www.w3.org/TR/webxr/">WebXR</Link>access VR/AR devices
          </ListItem>
        </UnorderedList>
        <Text textAlign="center">
          <span role="img" aria-label="hand pointing right">
            👉
          </span>
          <Link href="https://whatwebcando.today">whatwebcando.today</Link>
          <span role="img" aria-label="hand pointing left">
            👈
          </span>
        </Text>
      </>
    );
  }
}
