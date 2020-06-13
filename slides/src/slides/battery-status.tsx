import React, { Component } from "react";
import { CodePane, FlexBox, Heading } from "spectacle";
// @ts-ignore
import prismTheme from "prism-react-renderer/themes/nightOwlLight";

import { ClientManager } from "./client-manager";
import { BubbleChart } from "./bubble-chart";

export default class BatteryStatusSlide extends Component<{
  clientManager: ClientManager;
}> {
  componentDidMount() {
    this.props.clientManager.switchClients("battery");
  }

  render() {
    return (
      <>
        <Heading>battery status API</Heading>
        <FlexBox padding={0} flexDirection="row" alignItems="stretch" justifyContent="space-around">
          <BubbleChart clientManager={this.props.clientManager} />
          <CodePane
            language="javascript"
            autoFillHeight
            theme={prismTheme}
          >{`// promise-based API
const battery = await navigator.getBattery();
if (battery.charging) {
  console.log('battery is charging');
}
console.log(\`\${battery.level * 100} % battery remaining\`);

battery.addEventListener('chargingchange', () => {
  console.log('charging status changed');
});

battery.addEventListener('levelchange', () => {
  console.log('battery level changed');
});
              `}</CodePane>
        </FlexBox>
      </>
    );
  }
}
