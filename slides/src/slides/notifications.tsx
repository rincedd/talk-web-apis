import React, { Component } from "react";
import { Box, CodePane, Heading } from "spectacle";
// @ts-ignore
import prismTheme from "prism-react-renderer/themes/nightOwlLight";

import { ClientManager } from "./client-manager";

const example = `Notification.requestPermission().then(result => {
  if (result === 'granted') {
    new Notification('New message', {
      icon: '/images/new-message-icon.png',
      body: 'You have 5 unread messages.'
    });
  }
});`;

export default class NotificationsSlide extends Component<{ clientManager: ClientManager }, { notificationsAllowed: boolean }> {
  constructor(props: Readonly<{ clientManager: ClientManager }>) {
    super(props);
    this.state = { notificationsAllowed: false };
  }

  componentDidMount() {
    this.props.clientManager.switchClients("notifications");
    if ("Notification" in window) {
      window.Notification.requestPermission().then((result) => {
        this.setState({ notificationsAllowed: result === "granted" });
      });
    }
  }

  notifyMe() {
    new Notification("Meow!", {
      body: "I knew you were waiting for cat pictures...",
      icon: require("../assets/hungry-cat.png"),
    });
  }

  render() {
    return (
      <>
        <Heading size={3} fit margin="2rem">
          system-level popup notifications
        </Heading>
        <Box m="25px 0">
          <CodePane language="javascript" autoFillHeight theme={prismTheme}>
            {example}
          </CodePane>
        </Box>
        <div style={{ margin: "0 auto" }}>
          <button className="btn" disabled={!this.state.notificationsAllowed} onClick={() => this.notifyMe()}>
            Notify me
          </button>
        </div>
      </>
    );
  }
}
