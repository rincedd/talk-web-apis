import React from "react";
import {
  Appear,
  Box,
  CodePane,
  CodeSpan,
  Deck,
  FlexBox,
  Heading,
  Image,
  Link,
  ListItem,
  Progress,
  Slide,
  Text,
  UnorderedList,
} from "spectacle";
// @ts-ignore
import prismTheme from "prism-react-renderer/themes/nightOwlLight";

import { ClientManager } from "./client-manager";
import BatteryStatusSlide from "./battery-status";
import GeolocationSlide from "./geolocation";
import SpeechSynthesisSlide from "./speech-synthesis";
import NotificationsSlide from "./notifications";
import MiscSlide from "./misc";
import UserMediaSlide from "./usermedia";
import WebAudioSlide from "./web-audio";
import CrowsSlide from "./web-audio-crows";
import WhatsNextSlide from "./whats-next";
import { JoinMeSlide } from "./join-me";
import NetworkInfoSlide from "./network";
import ClientSideFileHandling from "./client-side-file-handling";
import { SectionTitle } from "./section-title";

import "./styles.css";

import logo from "../assets/tng-logo.svg";
import browsers from "../assets/browsers.png";
import netscape from "../assets/netscape_icon.svg";
import webapp from "../assets/smartphone-app.png";
import html5logo from "../assets/HTML5_Logo.svg";
import w3clogo from "../assets/w3c.svg";
import whatwglogo from "../assets/WHATWG_logo.svg";

const clientManager = new ClientManager();

// @ts-ignore
const deckTemplate = ({ slideNumber = 0, numberOfSlides }) => {
  return slideNumber > 0 ? (
    <FlexBox justifyContent="space-between" position="absolute" bottom={0} width={1}>
      <Box padding="0 1em">
        <Image src={logo} width="35%" />
      </Box>
      <Box padding="0 1em">
        <Progress color="#CECECE" size={8} />
      </Box>
    </FlexBox>
  ) : null;
};

const theme = {
  colors: {
    primary: "#1F2022",
    secondary: "#03A9FC",
    tertiary: "#ffffff",
    quartenary: "#CECECE",
  },
  space: [12, 20, 28],
  size: {
    maxCodePaneHeight: "500px",
  },
};

export class Presentation extends React.Component {
  render() {
    return (
      <Deck transitionEffect="fade" template={deckTemplate} theme={theme}>
        <Slide>
          <Heading className="title" fontSize="116px">
            Web APIs in modern browsers
          </Heading>
          <Text fontSize="40px" margin="1em 0" textAlign="center">
            Dr. Gerd Zschaler
          </Text>
          <Text textAlign="center">
            <Image src={logo} width="25%" />
          </Text>
        </Slide>
        <Slide>
          <FlexBox justifyContent="space-around" alignItems="center" height="100%">
            <Image width="160px" src={netscape} />
          </FlexBox>
        </Slide>
        <Slide>
          <FlexBox justifyContent="space-around" alignItems="center" height="100%">
            <Image width="400px" src={browsers} />
          </FlexBox>
        </Slide>
        <Slide>
          <Heading>web page</Heading>
          <Text textAlign="center">
            <a
              title="Wikipedia users; see history of Main Page at Main Page history / CC BY-SA (http://creativecommons.org/licenses/by-sa/3.0/)"
              href="https://commons.wikimedia.org/wiki/File:HomePage_of_WikiPedia_on_3_March_2001.jpg"
            >
              <img
                width="512"
                alt="HomePage of WikiPedia on 3 March 2001"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/HomePage_of_WikiPedia_on_3_March_2001.jpg/512px-HomePage_of_WikiPedia_on_3_March_2001.jpg"
              />
            </a>
          </Text>
        </Slide>
        <Slide>
          <Heading>
            web <span style={{ textDecoration: "line-through" }}>page</span> app
          </Heading>
          <Text textAlign="center">
            <Image width="300px" src={webapp} />
          </Text>
        </Slide>
        <Slide>
          <Heading>web app platform</Heading>
          <UnorderedList margin="20px auto">
            <ListItem>
              <Image width="1em" src={html5logo} /> HTML5
            </ListItem>
            <ListItem>
              Web APIs
              <UnorderedList>
                <ListItem>
                  <Image width="1em" src={w3clogo} /> <Link href="https://vimeo.com/110256895">w3c.org</Link>
                </ListItem>
                <ListItem>
                  <Image width="1em" src={whatwglogo} /> <Link href="https://whatwg.org/">whatwg.org</Link>
                </ListItem>
              </UnorderedList>
            </ListItem>
            <Appear elementNum={0} transitionEffect={{ to: { opacity: 1 }, from: { opacity: 0 } }}>
              <ListItem>
                a huge developer
                <Link target="_blank" href="https://devdocs.io/dom">
                  playground
                </Link>
                😄
              </ListItem>
            </Appear>
          </UnorderedList>
        </Slide>

        <Slide>
          <SectionTitle>handle data on the client-side</SectionTitle>
        </Slide>
        <Slide>
          <Heading>binary data</Heading>
          <UnorderedList>
            <ListItem>
              typed arrays <CodeSpan>Uint8Array</CodeSpan>...
            </ListItem>
            <ListItem>
              <CodeSpan>ArrayBuffer</CodeSpan>, <CodeSpan>Blob</CodeSpan>
            </ListItem>
            <ListItem>
              <CodeSpan>File, FileReader, createObjectURL()</CodeSpan>
            </ListItem>
            <ListItem>
              web workers for expensive computations
            </ListItem>
          </UnorderedList>
        </Slide>
        <Slide>
          <Heading>reading/generating files</Heading>
          <CodePane autoFillHeight indentSize={4} language="javascript" theme={prismTheme}>{`
// get file from <input> element
const file = document.querySelector('#my-input').files[0];

const reader = new FileReader();

reader.on('loadend', () => {
  const numWords = reader.result.split(/\\s+/).length;
  console.log(\`\${numWords} words found in \${file.name}\`);
});

reader.readAsText(file);

// download contents of my fancy <canvas> drawing as image
document.querySelector('canvas').toBlob(blob => {
  const url = URL.createObjectURL(blob);
  location.assign(url);
});

          `}</CodePane>
        </Slide>
        <Slide>
          <ClientSideFileHandling />
        </Slide>
        <Slide>
          <SectionTitle>notify the user</SectionTitle>
        </Slide>
        <Slide>
          <NotificationsSlide clientManager={clientManager} />
        </Slide>
        <Slide>
          <SectionTitle>interact with the OS/device</SectionTitle>
        </Slide>
        <Slide>
          <JoinMeSlide clientManager={clientManager} />
        </Slide>
        <Slide>
          <BatteryStatusSlide clientManager={clientManager} />
        </Slide>
        <Slide>
          <NetworkInfoSlide clientManager={clientManager} />
        </Slide>
        <Slide>
          <UserMediaSlide clientManager={clientManager} />
        </Slide>
        <Slide>
          <GeolocationSlide clientManager={clientManager} />
        </Slide>
        <Slide>
          <MiscSlide clientManager={clientManager} />
        </Slide>
        <Slide>
          <SectionTitle>go crazy</SectionTitle>
        </Slide>
        <Slide>
          <SpeechSynthesisSlide clientManager={clientManager} />
        </Slide>
        <Slide>
          <WebAudioSlide />
        </Slide>
        <Slide>
          <CrowsSlide clientManager={clientManager} />
        </Slide>
        <Slide>
          <WhatsNextSlide clientManager={clientManager} />
        </Slide>
        <Slide>
          <Heading>Links</Heading>
          <UnorderedList>
            <ListItem>
              <Link href="http://devdocs.io/dom/">devdocs.io/dom</Link>
            </ListItem>
            <ListItem>
              <Link href="https://github.com/mdn">MDN on github</Link>
            </ListItem>
            <ListItem>
              <Link href="http://caniuse.com/">caniuse.com</Link>
            </ListItem>
            <ListItem>
              <Link href="https://www.html5rocks.com">html5rocks.com</Link>
            </ListItem>
            <ListItem>
              cat icon by <Link href="http://iconka.com/">iconka</Link>
            </ListItem>
            <ListItem>
              crow recording from <Link href="http://www.xeno-canto.org/348301">xeno-canto.org</Link>
            </ListItem>
          </UnorderedList>
        </Slide>
        <Slide>
          <SectionTitle>?</SectionTitle>
        </Slide>
      </Deck>
    );
  }
}
