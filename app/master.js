import './master.css';
import Faye from 'faye/src/faye_browser';
import { select, interpolateViridis, forceSimulation, forceCollide, forceX, forceY } from 'd3';

const faye = new Faye.Client('/faye', { timeout: 60 });

const CIRCLE_RADIUS = 15;

const clients = [];
const clientsById = new Map();

const simulation = forceSimulation(clients)
  .velocityDecay(0.01)
  .force('x', forceX().strength(0.004))
  .force('y', forceY().strength(0.004))
  .force('collide', forceCollide().radius(CIRCLE_RADIUS).strength(0.5))
  .on('tick', () => requestAnimationFrame(renderBubbleChart));

faye.subscribe('/battery', client => {
  if (clientsById.has(client.id)) {
    Object.assign(clientsById.get(client.id), client);
  } else {
    const clientObj = { ...client, r: CIRCLE_RADIUS };
    clients.push(clientObj);
    clientsById.set(client.id, clientObj);
  }
  renderSimulation();
});

function renderBubbleChart() {
  const circles =
    select('svg').select('g').selectAll('circle')
      .data(clients, function (d) {
        return d.id ? d.id : this.id;
      });
  circles
    .attr('cx', d => d.x)
    .attr('cy', d => d.y);
  circles.enter()
    .append('circle')
    .classed('node', true)
    .classed('charging', d => d.charging)
    .style('fill', d => d.batteryLevel ? interpolateViridis(d.batteryLevel) : '#aaa')
    .attr('r', 0.1 * CIRCLE_RADIUS)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .transition().duration(250)
    .attr('r', CIRCLE_RADIUS);
}

function renderSimulation() {
  simulation.nodes(clients).alpha(1).restart();
}
