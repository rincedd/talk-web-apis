import React, {Component} from "react";
import {ClientManager} from "./client-manager";
import {Heading, Link, Text} from "spectacle";
import QRCode from "qrcode.react";

export class JoinMeSlide extends Component<{ clientManager: ClientManager }, { numClients: number }> {
    constructor(props: Readonly<{ clientManager: ClientManager; }>) {
        super(props);
        this.state = {numClients: 0};
    }

    onClientChange = () => this.setState({numClients: this.props.clientManager.getClients().length});

    componentDidMount() {
        this.props.clientManager.on('update', this.onClientChange);
        this.setState({numClients: this.props.clientManager.getClients().length});
    }

    componentWillUnmount() {
        this.props.clientManager.off('update', this.onClientChange)
    }

    render() {
        return <>
            <Heading>Let's try something...</Heading>
            <Text textAlign="center"><QRCode size={256} value="https://talk-web-apis.netlify.app/client"/> {this.state.numClients} joined</Text>
            <Text textAlign="center"><Link
                href="https://talk-web-apis.netlify.app/client">https://talk-web-apis.netlify.app/client</Link></Text>
        </>
    }
}
