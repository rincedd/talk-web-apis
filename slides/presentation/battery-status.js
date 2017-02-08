import React, { Component, PropTypes } from 'react';
import { Heading, Fill, Fit, Layout, CodePane } from 'spectacle';
import { select, interpolateViridis, forceSimulation, forceCollide, forceX, forceY } from 'd3';
import codeExample from 'raw-loader!./battery.sample';

const CIRCLE_RADIUS = 15;

export default class BatteryStatusSlide extends Component {
  static propTypes = {
    clientManager: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.clientManager.switchClients('battery');
    this._simulation = forceSimulation(this.props.clientManager.getClients())
      .velocityDecay(0.01)
      .force('x', forceX().strength(0.004))
      .force('y', forceY().strength(0.004))
      .force('collide', forceCollide().radius(CIRCLE_RADIUS).strength(0.5))
      .on('tick', () => requestAnimationFrame(() => this._renderBubbleChart()));

    this._clientMangerUpdateHandler = () => this._simulation.nodes(this.props.clientManager.getClients()).alpha(1).restart();
    this.props.clientManager.on('update', this._clientMangerUpdateHandler);
  }

  componentWillUnmount() {
    this.props.clientManager.removeListener('update', this._clientMangerUpdateHandler);
  }

  componentDidUpdate() {
    this._adjustOrigin();
  }

  _adjustOrigin() {
    if (this._svg) {
      this._svg.querySelector('g').setAttribute('transform', `translate(${this._svg.clientWidth / 2}, ${this._svg.clientHeight / 2})`);
    }
  }

  _renderBubbleChart() {
    const circles = select(this._svg).select('g').selectAll('circle')
      .data(this.props.clientManager.getClients(), function (d) {
        return d.id ? d.id : this.id;
      })
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .classed('charging', d => d.charging)
      .style('fill', d => d.batteryLevel ? interpolateViridis(d.batteryLevel) : '#aaa');
    circles.enter()
      .append('circle')
      .classed('node', true)
      .attr('r', 0.1 * CIRCLE_RADIUS)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .transition().duration(250)
      .attr('r', CIRCLE_RADIUS);
  }

  render() {
    return (
      <div>
        <Heading lineHeight={1.1} size={3}>Battery Status API</Heading>
        <Layout>
          <Fill>
            <svg className="bubble-chart" ref={e => this._svg = e}>
              <g />
            </svg>
          </Fill>
          <Fit>
            <CodePane lang="javascript" source={codeExample} />
          </Fit>
        </Layout>
      </div>
    );
  }
}
