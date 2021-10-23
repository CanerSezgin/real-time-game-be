import Game from '../types/Game';
import Player from '../types/Player';
import Round from '../types/Round';

export default interface IGameController {
  getCurrentNumber(): number;
  getLastRound(): Round | null;
  setNextRound(): void;
  processSelection(selection: GameSelection): void;
}
