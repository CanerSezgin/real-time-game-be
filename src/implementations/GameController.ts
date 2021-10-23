import IGameController from '../entities/interfaces/gameController';
import generateUniqueId from '../utils/generateUniqueId';
import Player from '../entities/types/Player';
import GameStatus from '../entities/types/GameStatus';
import Game from './game';
import Round from './round';
import { RoundsController } from './game';

export default class GameController {
  constructor(private game: Game, private roundsCtrl: RoundsController) {}

  setNextRound(): void {
    let nextRound;
    const currentRound = this.roundsCtrl.currentRound;

    if (!currentRound) {
      nextRound = new Round(1, this.game.initNo, this.game.p1Id);
    } else {
      const opponentId =
        currentRound.playerId === this.game.p1Id
          ? this.game.p2Id
          : this.game.p1Id;

      nextRound = new Round(currentRound.id + 1, currentRound, opponentId);
    }

    this.roundsCtrl.insertRound(nextRound)
  }

  processSelection(selection: GameSelection): void {
    throw new Error('Method not implemented.');
  }
}
