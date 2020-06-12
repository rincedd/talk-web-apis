import React from 'react';
import {Box, CodePane, CodeSpan, Deck, FlexBox, Heading, Image, Link, ListItem, Progress, Slide, Text, UnorderedList} from 'spectacle';
import {ClientManager} from './client-manager';
import BatteryStatusSlide from './battery-status';
import GeolocationSlide from './geolocation';
import SpeechSynthesisSlide from './speech-synthesis';
import NotificationsSlide from './notifications';
import MiscSlide from './misc';
import UserMediaSlide from './usermedia';
import WebAudioSlide from './web-audio';
import CrowsSlide from './web-audio-crows';
import WhatsNextSlide from './whats-next';

import './styles.css';
import {SectionTitle} from "./section-title";

import logo from '../assets/tng-logo.svg';
import browsers from '../assets/browsers.png';

const clientManager = new ClientManager();

// @ts-ignore
const deckTemplate = ({slideNumber = 0, numberOfSlides}) => {
    return (
        slideNumber > 0 ? (<FlexBox
            justifyContent="space-between"
            position="absolute"
            bottom={0}
            width={1}
        >
            <Box padding="0 1em">
                <Image src={logo} width="35%"/>
            </Box>
            <Box padding="0 1em">
                <Progress color="#CECECE" size={8}/>
            </Box>
        </FlexBox>) : null
    );
}

const theme = {
    colors: {
        primary: '#1F2022',
        secondary: '#03A9FC',
        tertiary: '#ffffff',
        quartenary: '#CECECE'
    }
};

export class Presentation extends React.Component {
    render() {
        return (
            <Deck transitionEffect="none" template={deckTemplate} theme={theme}>
                <Slide>
                    <Heading className="title">Web APIs in modern browsers</Heading>
                    <Text textAlign="center">Dr. Gerd Zschaler</Text>
                    <FlexBox>
                        <Image src={logo} width="28%"/>
                    </FlexBox>
                </Slide>
                <Slide>
                    <Heading>HTML5, Web APIs, and standards</Heading>
                    <FlexBox flexDirection="column" alignItems="center">
                        <Box><Text textAlign="center"><Image width="50%" src={browsers}/></Text></Box>
                        <Box>
                            <Link href="https://vimeo.com/110256895">w3c.org</Link>
                            <Link href="https://whatwg.org/">whatwg.org</Link>
                        </Box>
                        <Box><Text>overview: <Link href="https://developer.mozilla.org/en-US/docs/Web/API">MDN</Link></Text></Box>
                    </FlexBox>
                </Slide>
                <Slide>
                    <SectionTitle>handle data on the client-side</SectionTitle>
                </Slide>
                <Slide>
                    <Heading>binary data</Heading>
                    <UnorderedList>
                        <ListItem>typed arrays <CodeSpan>Uint8Array</CodeSpan>...</ListItem>
                        <ListItem><CodeSpan>ArrayBuffer</CodeSpan></ListItem>
                        <ListItem><CodeSpan>File</CodeSpan>, <CodeSpan>Blob</CodeSpan></ListItem>
                        <ListItem><CodeSpan>URL.createObjectURL()</CodeSpan></ListItem>
                    </UnorderedList>
                </Slide>
                <Slide>
                    <Heading>reading/generating files</Heading>
                    <CodePane autoFillHeight language="javascript">{`
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
                    <SectionTitle>notify the user</SectionTitle>
                </Slide>
                <Slide><NotificationsSlide clientManager={clientManager}/></Slide>
                <Slide>
                    <SectionTitle>interact with the OS/device</SectionTitle>
                </Slide>
                <Slide>
                    <Heading>bit.ly/2l0DPvU</Heading>
                    <Text><Link href="https://talk-web-apis.de">https://talk-web-apis.de</Link></Text>
                </Slide>
                <Slide><BatteryStatusSlide clientManager={clientManager}/></Slide>
                <Slide><UserMediaSlide clientManager={clientManager}/></Slide>
                <Slide><GeolocationSlide clientManager={clientManager}/></Slide>
                <Slide><MiscSlide clientManager={clientManager}/></Slide>
                <Slide>
                    <SectionTitle>go crazy</SectionTitle>
                </Slide>
                <Slide><SpeechSynthesisSlide clientManager={clientManager}/></Slide>
                <Slide><WebAudioSlide/></Slide>
                <Slide><CrowsSlide clientManager={clientManager}/></Slide>
                <Slide><WhatsNextSlide clientManager={clientManager}/></Slide>
                <Slide>
                    <Heading>Links</Heading>
                    <UnorderedList>
                        <ListItem><Link href="http://devdocs.io/dom/">devdocs.io/dom</Link></ListItem>
                        <ListItem><Link href="https://github.com/mdn">MDN on github</Link></ListItem>
                        <ListItem><Link href="http://caniuse.com/">caniuse.com</Link></ListItem>
                        <ListItem><Link href="https://www.html5rocks.com">html5rocks.com</Link></ListItem>
                        <ListItem>cat icon by <Link href="http://iconka.com/">iconka</Link></ListItem>
                        <ListItem>crow recording from <Link href="http://www.xeno-canto.org/348301">xeno-canto.org</Link></ListItem>
                    </UnorderedList>
                </Slide>
                <Slide>
                    <SectionTitle>?</SectionTitle>
                </Slide>
            </Deck>
        );
    }
}
