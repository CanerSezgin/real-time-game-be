import SocketIO from 'socket.io';
import { Server } from 'http';

import MemoryGameRepository from '../implementations/gameRepository/MemoryGameRepository';
import GameController from '../implementations/GameController';
import {
  GameController as GameController2,
  GameTable,
  RoundCtrl,
} from '../implementations/GameController2';
import GameSelection from '../entities/types/GameSelection';

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

    /* socket.on('create-game', async (initNo: number) => {
      const p1Id = socket.id;
      const game = await gameRepo.create(p1Id, initNo);
      const gameCtrl = new GameController(game);
      gameCtrl.setNextRound()
      console.log('Game Created', game);
      socket.emit('game-created', game);
    }); */

    const games = [
      new GameController2(
        new GameTable('p1_id_here', 34),
        new RoundCtrl(),
        'p2_id'
      ),
    ];

    socket.on('get-game', async (gameId) => {
      const game = games[0];
      console.log("get game", gameId, game)
      socket.to(gameId).emit('get-game-response', game);
    });

    socket.on('play-game', async (gameId, selection: GameSelection) => {
      const game = games[0]
      console.log(game.rounds);

      game.select(selection);
      game.checkRoundResult();
      console.log(game.rounds);
      console.log(game.game);

      socket.to(gameId).emit('receive-result', game.game);
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
