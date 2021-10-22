import Game from '../types/Game';
import Player from '../types/Player';

export default interface IGameRepository {
  getAll(): Promise<Game[]>;
  getManyByPlayerId(playerId: Player['id']): Promise<Game[]>;
  getOneByGameId(gameId: Game['id']): Promise<Game | null>;
  create(p1Id: Player['id'], initNo: number): Promise<Game>;
}
