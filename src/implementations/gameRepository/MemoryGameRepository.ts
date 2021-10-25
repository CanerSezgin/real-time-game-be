import IGameRepository from '../../entities/interfaces/gameRepository';
import GameWithState from '../game/GameWithState';

class MemoryGameRepository implements IGameRepository<GameWithState> {
  private games: GameWithState[] = [];

  async getAllGames(): Promise<GameWithState[]> {
    return this.games;
  }
  async getGameById(id: string): Promise<GameWithState> {
    const game = this.games.find((game) => game.id === id);
    if (!game) throw new Error(`Game not found by ID: ${id}`);
    return game;
  }
  async joinGame(playerId: string): Promise<GameWithState> {
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

export default MemoryGameRepository;
