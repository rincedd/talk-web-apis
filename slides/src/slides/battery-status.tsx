import React, {Component} from 'react';
import {Box, CodePane, FlexBox, Heading} from 'spectacle';
import {forceCollide, forceSimulation, forceX, forceY, interpolateViridis, select, Simulation, SimulationNodeDatum} from 'd3';
import {Client, ClientManager} from "./client-manager";

const CIRCLE_RADIUS = 15;

type NodeType = SimulationNodeDatum & Client;

export default class BatteryStatusSlide extends Component<{ clientManager: ClientManager }> {
    // @ts-ignore
    private simulation: Simulation<NodeType, undefined>;
    private clientMangerUpdateHandler = () => this.simulation.nodes(this.getNodes()).alpha(1).restart();
    private svg: SVGSVGElement | null = null;

    getNodes(): NodeType[] {
        return this.props.clientManager.getClients();
    }

    componentDidMount() {
        this.props.clientManager.switchClients('battery');
        this.simulation = forceSimulation(this.getNodes())
            .velocityDecay(0.01)
            .force('x', forceX().strength(0.004))
            .force('y', forceY().strength(0.004))
            .force('collide', forceCollide().radius(CIRCLE_RADIUS).strength(0.5))
            .on('tick', () => requestAnimationFrame(() => this._renderBubbleChart()));

        this.props.clientManager.on('update', this.clientMangerUpdateHandler);
    }

    componentWillUnmount() {
        this.props.clientManager.removeListener('update', this.clientMangerUpdateHandler);
    }

    componentDidUpdate() {
        this._adjustOrigin();
    }

    _adjustOrigin() {
        this.svg?.querySelector('g')?.setAttribute('transform', `translate(${this.svg.clientWidth / 2}, ${this.svg.clientHeight / 2})`);
    }

    _renderBubbleChart() {
        if (!this.svg) {
            return;
        }
        // @ts-ignore
        const circles = select(this.svg).select('g').selectAll('circle')
            .data(this.getNodes(), function (d: NodeType) {
                // @ts-ignore
                return d.id ? d.id : this?.id;
            })
            .attr('cx', (d: NodeType) => d.x)
            .attr('cy', (d: NodeType) => d.y)
            .classed('charging', (d: Client) => d.charging)
            .style('fill', (d: Client) => d.batteryLevel ? interpolateViridis(d.batteryLevel) : '#aaa');
        circles.enter()
            .append('circle')
            .classed('node', true)
            .attr('r', 0.1 * CIRCLE_RADIUS)
            .attr('cx', (d: NodeType) => d.x)
            .attr('cy', (d: NodeType) => d.y)
            .transition().duration(250)
            .attr('r', CIRCLE_RADIUS);
    }

    render() {
        return (
            <div>
                <Heading lineHeight={1.1} size={3}>battery status API</Heading>
                <FlexBox>
                    <Box>
                        <svg className="bubble-chart" ref={e => this.svg = e}>
                            <g/>
                        </svg>
                    </Box>
                    <CodePane language="javascript" autoFillHeight>{`
// promise-based API
navigator.getBattery().then(battery => {
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
});
          `}</CodePane>
                </FlexBox>
            </div>
        );
    }
}
