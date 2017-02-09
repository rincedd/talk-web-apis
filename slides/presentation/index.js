// Import React
import React from 'react';
// Import Spectacle Core tags
import {Code, CodePane, List, ListItem, Deck, Heading, Slide, Text, Image, Link} from 'spectacle';
// Import image preloader util
import preloader from 'spectacle/lib/utils/preloader';
// Import theme
import createTheme from 'spectacle/lib/themes/default';
import ClientManager from './client-manager';
import BatteryStatusSlide from './battery-status';
import GeolocationSlide from './geolocation';
import SpeechSynthesisSlide from './speech-synthesis';
import NotificationsSlide from './notifications';
import MiscSlide from './misc';
import UserMediaSlide from './usermedia';
import WebAudioSlide from './web-audio';
import CrowsSlide from './web-audio-crows';

// Require CSS
require('normalize.css');
require('spectacle/lib/themes/default/index.css');
require('./styles.css');

const images = {
  logo: require('../assets/tng.svg'),
};

preloader(images);

const theme = createTheme({
  primary: 'white',
  secondary: '#1F2022',
  tertiary: '#03A9FC',
  quartenary: '#CECECE'
}, {
  primary: 'Montserrat',
  secondary: 'Helvetica'
});

const clientManager = new ClientManager();

export default class Presentation extends React.Component {
  render() {
    return (
      <Deck transition={['slide']} transitionDuration={500} theme={theme}>
        <Slide id="title" transition={['zoom']}>
          <Heading size={1} caps textColor="secondary">Web APIs in modern browsers</Heading>
          <Text margin="25px 0" bold textColor="tertiary">Gerd Zschaler</Text>
          <Image src={images.logo} width="28%" />
        </Slide>
        <Slide>
          <Link href="https://developer.mozilla.org/en-US/docs/Web/API">MDN</Link>
        </Slide>
        <Slide>
          <Heading size={2} caps fit textColor="tertiary">handle data on the client-side</Heading>
        </Slide>
        <Slide>
          <Heading size={3}>binary data</Heading>
          <List>
            <ListItem>typed arrays <Code>Uint8Array</Code>...</ListItem>
            <ListItem><Code>ArrayBuffer</Code></ListItem>
            <ListItem><Code>File</Code>, <Code>Blob</Code></ListItem>
            <ListItem><Code>URL.createObjectURL()</Code></ListItem>
          </List>
        </Slide>
        <Slide>
          <Heading size={3} margin="1rem">reading/generating files</Heading>
          <CodePane textSize="1rem" lang="javascript" source={require('raw-loader!./file.sample')} />
        </Slide>
        <Slide>
          <Heading size={2} caps textColor="tertiary">notify the user</Heading>
        </Slide>
        <Slide><NotificationsSlide /></Slide>
        <Slide>
          <Heading caps fit size={3} textColor="tertiary">interact with the OS/device</Heading>
        </Slide>
        <Slide><UserMediaSlide /></Slide>
        <Slide><BatteryStatusSlide clientManager={clientManager} /></Slide>
        <Slide><GeolocationSlide clientManager={clientManager} /></Slide>
        <Slide><MiscSlide clientManager={clientManager} /></Slide>
        <Slide>
          <Heading size={2} caps textColor="tertiary">go crazy</Heading>
        </Slide>
        <Slide><SpeechSynthesisSlide clientManager={clientManager} /></Slide>
        <Slide><WebAudioSlide /></Slide>
        <Slide><CrowsSlide clientManager={clientManager}/></Slide>
        <Slide>
          <Heading size={3}>Links</Heading>
          <List>
            <ListItem><Link href="http://devdocs.io/dom/">devdocs.io/dom</Link></ListItem>
            <ListItem><Link href="https://github.com/mdn">MDN on github</Link></ListItem>
            <ListItem><Link href="http://caniuse.com/">caniuse.com</Link></ListItem>
            <ListItem><Link href="https://www.html5rocks.com">html5rocks.com</Link></ListItem>
            <ListItem>cat icon by <Link href="http://iconka.com/">iconka</Link></ListItem>
            <ListItem>crow recording from <Link href="http://www.xeno-canto.org/348301">xeno-canto.org</Link></ListItem>
          </List>
        </Slide>
      </Deck>
    );
  }
}
