import React from "react";
import { ClientManager } from "./client-manager";
import { FlexBox, Heading, Link, Text } from "spectacle";
import QRCode from "qrcode.react";
import { BubbleChart } from "./bubble-chart";

export function JoinMeSlide(props: { clientManager: ClientManager }) {
  const joinLink = `https://talk-web-apis.netlify.app/client?session=${props.clientManager.sessionId}`;
  return (
    <>
      <Heading>Let's try something...</Heading>
      <FlexBox padding={0} justifyContent="space-around" alignItems="stretch">
        <QRCode size={256} value={joinLink} />
        <BubbleChart clientManager={props.clientManager} />
      </FlexBox>
      <Text textAlign="center">
        <Link href={joinLink}>{joinLink}</Link>
      </Text>
    </>
  );
}
