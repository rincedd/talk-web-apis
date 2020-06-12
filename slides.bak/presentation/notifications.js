import React, { Component, PropTypes } from 'react';
import { CodePane, Heading, Layout, Fill } from 'spectacle';

const example = `Notification.requestPermission().then(result => {
  if (result === 'granted') {
    new Notification('New message', {
      icon: '/images/new-message-icon.png',
      body: 'You have 5 unread messages.'
    });
  }
});`;

export default class NotificationsSlide extends Component {
  static propTypes = {
    clientManager: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { notificationsAllowed: false };
  }

  componentDidMount() {
    this.props.clientManager.switchClients('notifications');
    if ('Notification' in window) {
      window.Notification.requestPermission().then(result => {
        this.setState({ notificationsAllowed: result === 'granted' });
      });
    }
  }

  notifyMe() {
    new Notification('Meow!', {
      body: 'I knew you were waiting for cat pictures...',
      icon: require('../assets/hungry-cat.png')
    });
  }

  render() {
    return <div>
      <Heading size={3} fit margin="2rem">system-level popup notifications</Heading>
      <Layout>
        <Fill>
          <button disabled={!this.state.notificationsAllowed} onClick={() => this.notifyMe()}>Notify me</button>
        </Fill>
        <Fill>
          <CodePane textSize="1rem" lang="javascript" source={example} />
        </Fill>
      </Layout>
    </div>;
  }
}
