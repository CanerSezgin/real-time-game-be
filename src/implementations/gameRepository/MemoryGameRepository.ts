import IGameRepository from '../../entities/interfaces/gameRepository';
import Game from '../../entities/types/Game';
import GameStatus from '../../entities/types/GameStatus';
import generateUniqueId from '../../utils/generateUniqueId';
import wait from '../../utils/wait';
import Player from '../../entities/types/Player';
import GameSelection from '../../entities/types/GameSelection';

class Round {
  public selection = GameSelection;

  constructor(
    public id: number,
    public startNo: number,
    public playerId: Player['id']
  ) {}
}

class MemoryGameRepository implements IGameRepository {
  private _games: Game[] = [];

  async getAllGames(): Promise<Game[]> {
    return this._games;
  }
  async getActiveGames(): Promise<Game[]> {
    return this._games.filter((game) => game.status === GameStatus.ACTIVE);
  }
  async getPendingGames(): Promise<Game[]> {
    return this._games.filter((game) => game.status === GameStatus.PENDING);
  }
  async getGamesByPlayerId(playerId: string): Promise<Game[]> {
    return this._games.filter(
      (game) => game.p1Id === playerId || game.p2Id === playerId
    );
  }
  async getByGameId(gameId: string): Promise<Game | null> {
    return this._games.find((game) => game.id === gameId) || null;
  }
  async create(p1Id: string, initNo: number): Promise<Game> {
    const game: Game = {
      id: generateUniqueId('GM-'),
      p1Id,
      p2Id: null,
      initNo,
      rounds: [],
      status: GameStatus.PENDING,
    };

    // this is just for testing purpose
    await wait(1000);

    this._games.push(game);
    return game;
  }
}

export default MemoryGameRepository;
