import SocketIO from 'socket.io';
import { Server } from 'http';

export const initSocket = (httpServer: Server): void => {
  const io = new SocketIO.Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    socket.on('play-game', (gameId, game) => {
      console.log({ gameId, game });
      socket.to(gameId).emit('receive-result', game);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id);
    });
  });

  /* const games = [];
      
      const startGame = (socket, player1Id, gameId, initNumber) => {
        const game = {
          player1Id,
          player2Id: null,
          gameId,
          initNumber,
        };
      
        games.push(game);
        socket.emit('new-game-created', games);
      }; */
};
