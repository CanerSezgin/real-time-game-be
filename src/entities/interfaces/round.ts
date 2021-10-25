import Player from '../types/Player'
import Nullable from '../types/Nullable'
import GameSelection from '../types/GameSelection'

export default interface IRound {
  id: number;
  startNo: number;
  playerId: Player['id'];
  selection: Nullable<GameSelection>;
  finalNo: Nullable<number>;
  isFinished: boolean;
  saveResults(selection: GameSelection, finalNo: number): void;
}
