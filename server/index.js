const http = require('http');
const faye = require('faye');
const nodeStatic = require('node-static');

const port = 8000;

const fileServer = new nodeStatic.Server('../app/dist', { cache: false });
const server = http.createServer(function (req, res) {
  req.addListener('end', function () {
    fileServer.serve(req, res);
  }).resume();
});

const bayeux = new faye.NodeAdapter({ mount: '/faye', timeout: 45 });

bayeux.attach(server);

console.log(`Listening on ${port}`);
server.listen(port);
