import Game from '../types/Game';
import Player from '../types/Player';

export default interface IGameRepository {
  getAllGames(): Promise<Game[]>;
  getActiveGames(): Promise<Game[]>;
  getPendingGames(): Promise<Game[]>;
  getGamesByPlayerId(playerId: Player['id']): Promise<Game[]>;
  getByGameId(gameId: Game['id']): Promise<Game | null>;
  create(p1Id: Player['id'], initNo: number): Promise<Game>;
}
