import React, {Component} from "react";
import {ClientManager} from "./client-manager";
// @ts-ignore
import prismTheme from "prism-react-renderer/themes/nightOwlLight";
import {CodePane, Heading} from "spectacle";

const example = `
const connection = navigator.connection;

console.log(connection.type); // -> "wifi"
console.log(connection.effectiveType); // -> "3g"

console.log(navigator.onLine); // -> true
`;

export default class NetworkInfoSlide extends Component<{
  clientManager: ClientManager;
}> {
  componentDidMount() {
    this.props.clientManager.switchClients("network");
  }

  render() {
    // @ts-ignore
    const effectiveType = navigator.connection?.effectiveType;
    return (
      <>
        <Heading>network information</Heading>
        <CodePane autoFillHeight language="javascript" theme={prismTheme}>{example}</CodePane>
        <p>Your connection is effectively {effectiveType}.</p>
      </>
    );
  }
}
