import Player from '../types/Player'

export default interface IGameRepository<GameType> {
  getAllGames(): Promise<GameType[]>;
  getGameById(id: string): Promise<GameType>;
  joinGame(playerId: Player['id']): Promise<GameType>;
}
