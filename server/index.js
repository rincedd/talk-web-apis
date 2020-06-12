const http = require('http');
const faye = require('faye');

const PORT = 8080;

const server = http.createServer();
const bayeux = new faye.NodeAdapter({mount: '/', timeout: 45});

bayeux.attach(server);

server.listen(PORT, err => {
  if (err) {
    console.error(`Failed to start server: ${err.message}`);
  } else {
    console.log(`Listening on`, server.address());
  }
});
