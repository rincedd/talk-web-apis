const http = require('http');
const faye = require('faye');

const port = 8000;

const server = http.createServer();
const bayeux = new faye.NodeAdapter({ mount: '/faye', timeout: 45 });

bayeux.attach(server);

console.log(`Listening on ${port}`);
server.listen(port);
