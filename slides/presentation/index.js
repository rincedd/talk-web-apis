// Import React
import React from 'react';
// Import Spectacle Core tags
import { Deck, Heading, Slide, Text, Image } from 'spectacle';
// Import image preloader util
import preloader from 'spectacle/lib/utils/preloader';
// Import theme
import createTheme from 'spectacle/lib/themes/default';

// Require CSS
require("normalize.css");
require("spectacle/lib/themes/default/index.css");


const images = {
  logo: require("../assets/tng.svg"),
};

preloader(images);

const theme = createTheme({
  primary: "white",
  secondary: "#1F2022",
  tertiary: "#03A9FC",
  quartenary: "#CECECE"
}, {
  primary: "Montserrat",
  secondary: "Helvetica"
});

export default class Presentation extends React.Component {
  render() {
    return (
      <Deck transition={["zoom", "slide"]} transitionDuration={500} theme={theme}>
        <Slide id="title" transition={["zoom"]} bgColor="primary">
          <Heading size={1} fit caps lineHeight={1} textColor="secondary">
            Web APIs in modern browsers
          </Heading>
          <Text margin="25px 0" textColor="tertiary" bold>Gerd Zschaler</Text>
          <Image src={images.logo} width="28%" />
        </Slide>
        <Slide title="battery">
          <Heading fit size={1}>Battery Status API</Heading>
        </Slide>
      </Deck>
    );
  }
}
