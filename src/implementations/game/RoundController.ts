import Player from '../../entities/types/Player';
import Round from './Round';

export default class RoundController {
  private rounds: Round[] = [];

  createRound(startNo: number, playerId: Player['id']) {
    const round = new Round(this.noOfRounds + 1, startNo, playerId);
    this.rounds.push(round);
    return round;
  }

  get allRounds() {
    return this.rounds;
  }

  get currentRound(): Round | null {
    return this.rounds[this.noOfRounds - 1] || null;
  }

  get noOfRounds() {
    return this.rounds.length;
  }

  get playingPlayer() {
    return this.currentRound && !this.currentRound.isFinished
      ? this.currentRound.playerId
      : null;
  }

  get currentNo() {
    if (!this.currentRound) return null;
    return this.currentRound.isFinished && this.currentRound.finalNo === 1
      ? this.currentRound.finalNo
      : this.currentRound.startNo;
  }
}
