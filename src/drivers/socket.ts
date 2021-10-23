import SocketIO from 'socket.io';
import { Server } from 'http';

import MemoryGameRepository from '../implementations/gameRepository/MemoryGameRepository';
import GameController from '../implementations/GameController';

const gameRepo = new MemoryGameRepository();

export const initSocket = (httpServer: Server): void => {
  const io = new SocketIO.Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
    },
  });

  io.on('connection', async (socket) => {
    console.log('New client connected', socket.id);

    const pendingGames = await gameRepo.getPendingGames();
    socket.emit('show-pending-games', pendingGames);

    socket.on('create-game', async (initNo: number) => {
      const p1Id = socket.id;
      const game = await gameRepo.create(p1Id, initNo);
      const gameCtrl = new GameController(game);
      gameCtrl.setNextRound()
      console.log('Game Created', game);
      socket.emit('game-created', game);
    });

    socket.on('play-game', async (gameId) => {
      const game = await gameRepo.getByGameId(gameId);
      
      game?.rounds

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
