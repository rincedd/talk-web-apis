import React from "react";
import { ClientManager } from "./client-manager";
import { FlexBox, Heading, Link, Text } from "spectacle";
import { BubbleChart } from "./bubble-chart";
import { JoinLinkDisplay } from "./join-link-display";

export function JoinMeSlide(props: { clientManager: ClientManager }) {
  const joinLink = `https://talk-web-apis.netlify.app/client?session=${props.clientManager.sessionId}`;
  return (
    <>
      <Heading>let's try something...</Heading>
      <FlexBox padding={0} justifyContent="space-around" alignItems="stretch">
        <JoinLinkDisplay level="M" />
        <BubbleChart clientManager={props.clientManager} />
      </FlexBox>
      <Text textAlign="center">
        <Link href={joinLink}>{joinLink}</Link>
      </Text>
    </>
  );
}
