import SocketIO from 'socket.io';
import { Server } from 'http';

import MemoryGameRepository from '../implementations/gameRepository/MemoryGameRepository';
import GameSelection from '../entities/types/GameSelection';

import { gameService } from '../services/Games';
import Player from '../entities/types/Player';

const gameRepo = new MemoryGameRepository();

export const initSocket = (httpServer: Server): void => {
  const io = new SocketIO.Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
    },
  });

  io.on('connection', async (socket) => {
    console.log('New client connected', socket.id);

    socket.on('join', (gameId) => {
      console.log('joining', gameId);
      const game = gameService.getGameById(gameId);

      if (game) {
        socket.join(gameId);
        io.in(gameId).emit('get-game', game.gameCtrl.details);
      }
    });

    socket.on(
      'play-game',
      async (gameId, selection: GameSelection, playerId: Player['id']) => {
        const game = gameService.getGameById(gameId);

        if (game && game.players.includes(playerId)) {
          game.play(selection);
          io.in(gameId).emit('get-game', game.gameCtrl.details);
        }
      }
    );

    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id);
    });
  });
};
