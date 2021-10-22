const express = require('app');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

io.on('connection', (socket) => {
  console.log('connection event', socket);
});

httpServer.listen(3000);
