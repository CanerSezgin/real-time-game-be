import IGameRepository from '../../entities/interfaces/gameRepository';
import Game from '../../entities/types/Game';
import generateUniqueId from '../../utils/generateUniqueId';

class MemoryGameRepository implements IGameRepository {
  private _games: Game[] = [];

  async getAll(): Promise<Game[]> {
    return this._games;
  }
  async getManyByPlayerId(playerId: string): Promise<Game[]> {
    return this._games.filter(
      (game) => game.p1Id === playerId || game.p2Id === playerId
    );
  }
  async getOneByGameId(gameId: string): Promise<Game | null> {
    return this._games.find((game) => game.id === gameId) || null;
  }
  async create(p1Id: string, initNo: number): Promise<Game> {
    const game: Game = {
      id: generateUniqueId("GM-"),
      p1Id,
      p2Id: null,
      initNo,
      rounds: [],
    };

    this._games.push(game);
    return game;
  }
}

export default MemoryGameRepository;
