import SocketIO from 'socket.io';
import { Server } from 'http';

import MemoryGameRepository from '../implementations/gameRepository/MemoryGameRepository';
import GameController from '../implementations/GameController';
import {
  GameController as GameController2,
  GameTable,
} from '../implementations/GameController2';
import GameSelection from '../entities/types/GameSelection';
import { GameWithState } from '../implementations/Game3';
import Player from '../entities/types/Player';

const gameRepo = new MemoryGameRepository();

class Games {
  games: GameWithState[] = [];

  joinGame(playerId: Player['id']) {
    const game = this.getAPendingGame() || this.createAGame();
    game.joinGame(playerId);
    return game;
  }

  private createAGame() {
    const game = new GameWithState();
    this.games.push(game);
    return game;
  }

  private getAPendingGame() {
    return this.games.find((game) => game.isPending);
  }
}

const games = new Games();

export const initSocket = (httpServer: Server): void => {
  const io = new SocketIO.Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
    },
  });

  io.on('connection', async (socket) => {
    console.log('New client connected', socket.id);

    socket.on('join-game', (playerId: string) => {
      const pId = playerId || socket.id;
      const game = games.joinGame(pId);
      console.log(games.games);
      socket.emit('go-to-game', game.id);
    });

    /*     socket.on('get-game', async (gameId) => {
      const game = games[0];
      console.log('get game', gameId, game);
      socket.to(gameId).emit('get-game-response', game);
    });

    socket.on('play-game', async (gameId, selection: GameSelection) => {
      const game = games[0];
      console.log(game.rounds);

      game.select(selection);
      game.checkRoundResult();
      console.log(game.rounds);
      console.log(game.game);

      socket.to(gameId).emit('receive-result', game.game);
    }); */

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
