import Player from '../types/Player'
import IGameInstance from './gameInstance'

export default interface IGame {
  id: string;
  isFinished: boolean;
  isPending: boolean;
  instance: IGameInstance;
  sitP1Seat(pId: Player['id']): void;
  sitP2Seat(pId: Player['id']): void;
  start(): void;
  playingPlayerValidation(playerId: Player['id']): boolean;
  isThisPlayerOnTable(playerId: Player['id']): boolean;
}
