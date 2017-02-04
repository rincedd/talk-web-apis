import Faye from 'faye/src/faye_browser';

const client = new Faye.Client('/faye', { timeout: 60 });

const clientsById = {};

function render() {
  const listItems = Object.keys(clientsById).map(id => `<li>${id} [${clientsById[id].batteryLevel}]</li>`);
  document.querySelector('body').innerHTML = `<ul>${listItems.join('')}</ul>`;
}

client.subscribe('/battery', ({ id, batteryLevel }) => {
  clientsById[id] = { id, batteryLevel };
  render();
});
