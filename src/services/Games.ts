import Player from '../entities/types/Player';
import { Game, GameWithState } from '../implementations/Game3';

export class GamesService {
  games: GameWithState[] = [];

  getGameById(id: Game['id']) {
    return this.games.find((game) => game.id === id);
  }

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

export const gameService = new GamesService();