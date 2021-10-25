import GameStatus from '../types/GameStatus'
import Nullable from '../types/Nullable'
import Player from '../types/Player'
import IRound from './round'

export default interface IGameInstance {
  id: string;
  players: [Nullable<Player['id']>, Nullable<Player['id']>];
  rounds: IRound[];
  status: GameStatus;
  playing: Nullable<Player['id']>;
  number: Nullable<number>;
  winner: Nullable<Player['id']>;
}
