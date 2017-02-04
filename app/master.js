import Faye from 'faye/src/faye_browser';
import { select, interpolateViridis, packSiblings } from 'd3';

const faye = new Faye.Client('/faye', { timeout: 60 });

const clients = [];
const clientsById = new Map();

faye.subscribe('/battery', client => {
  if (clientsById.has(client.id)) {
    Object.assign(clientsById.get(client.id), client);
  } else {
    const clientObj = { ...client, r: 15 };
    clients.push(clientObj);
    clientsById.set(client.id, clientObj);
  }
  renderBubbleChart();
});

function renderBubbleChart() {
  packSiblings(clients);
  const circles =
    select('svg').select('g').selectAll('circle')
      .data(clients, function (d) {
        return d.id ? d.id : this.id;
      });
  circles.transition().duration(100)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y);
  circles.enter()
    .append('circle')
    .style('fill', d => d.batteryLevel ? interpolateViridis(d.batteryLevel) : '#aaa')
    .style('stroke', d => d.charging ? '#FF8F41' : '#777')
    .style('stroke-width', '2px')
    .attr('r', d => 0.1 * d.r)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .transition().duration(100)
    .attr('r', d => d.r);
}

