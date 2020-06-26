import { Box, FlexBox, Image, Progress } from "spectacle";
import logo from "../assets/tng-logo.svg";
import React from "react";
import {JoinLinkDisplay} from "./join-link-display";

// @ts-ignore
export function DeckTemplate({ slideNumber = 0, numberOfSlides }) {
  return slideNumber > 0 ? (
    <FlexBox justifyContent="space-between" position="absolute" bottom={0} width={1}>
      <Box padding="0 1em">
        <Image style={{margin: "0 20px"}} src={logo} width="114px" />
        {slideNumber > 13 && <JoinLinkDisplay level="L" size={48}/>}
      </Box>
      <Box padding="0 1em">
        <Progress color="#CECECE" size={8} />
      </Box>
    </FlexBox>
  ) : null;
}
