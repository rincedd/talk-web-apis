import React, { Component } from "react";

interface NetworkInformation extends EventTarget {
  type: string;
  effectiveType: string;
  downlink: number;
  downlinkMax: number;
  rtt: number;
}

function getConnection(): NetworkInformation | undefined {
  // @ts-ignore
  return navigator.connection || navigator.mozConnection || navigator.webkitConnection;
}

export default class NetworkInfo extends Component<any, { connection: NetworkInformation | undefined; online: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { connection: getConnection(), online: navigator.onLine };
  }

  componentDidMount() {
    const connection = getConnection();

    connection?.addEventListener("change", this.handleConnectionChange);
    window.addEventListener("online", this.handleOnlineChange);
    window.addEventListener("offline", this.handleOnlineChange);
  }

  componentWillUnmount() {
    const connection = getConnection();

    connection?.removeEventListener("change", this.handleConnectionChange);
    window.removeEventListener("online", this.handleOnlineChange);
    window.removeEventListener("offline", this.handleOnlineChange);
  }

  handleConnectionChange = () => {
    const connection = getConnection();
    this.setState({ connection });
  };

  handleOnlineChange = () => {
    this.setState({ online: navigator.onLine });
  };

  render() {
    const onlineState = navigator.onLine ? "online" : "offline";
    if (this.state.connection) {
      return (
        <div className={`slide network ${onlineState}`}>
          You are {onlineState} and connected via {this.state.connection.type}, effectively
          {this.state.connection.effectiveType}.
        </div>
      );
    }
    return (
      <div className={`slide network ${onlineState}`}>
        You are {onlineState}. The Network Information API is not available on your device.
      </div>
    );
  }
}
