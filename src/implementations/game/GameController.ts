import GameSelection from '../../entities/types/GameSelection';
import GameStatus from '../../entities/types/GameStatus';
import Player from '../../entities/types/Player';

import Round from './Round';
import Game from './Game';
import RoundController from './RoundController';

export default class GameController {
  constructor(private game: Game, private roundCtrl: RoundController) {}

  createNextRound() {
    if (this.game.status !== GameStatus.ACTIVE) {
      throw new Error("Game is not active. Round couldn't be created.");
    }

    const currentRound = this.roundCtrl.currentRound;

    if (!currentRound) {
      // Create First Round
      return this.roundCtrl.createRound(
        this.game.initNo,
        this.game.players[0]!
      );
    } else {
      if (!currentRound.finalNo) {
        throw Error(
          'There is already unfinished round. You can not create next round until it is done.'
        );
      }

      return this.roundCtrl.createRound(
        currentRound.finalNo,
        this.getPlayerIdsOfRound(currentRound).opponentId
      );
    }
  }

  private getPlayerIdsOfRound(round: Round) {
    const { playerId: playingPlayerId } = round;
    const opponentId =
      playingPlayerId === this.game.players[0]
        ? this.game.players[1]!
        : this.game.players[0]!;

    return {
      playingPlayerId,
      opponentId,
    };
  }

  private getCurrentRound() {
    const { currentRound } = this.roundCtrl;
    if (!currentRound)
      throw new Error('Current Round not found in game controller.');

    return currentRound;
  }

  select(selection: GameSelection) {
    const round = this.getCurrentRound();
    const finalNo = (round.startNo + selection) / 3;
    console.log({ start: round.startNo, finalNo, selection }, 'select');
    round.saveResults(selection, finalNo);
    console.log(round);
    return round;
  }

  next() {
    const round = this.getCurrentRound();
    const { opponentId, playingPlayerId } = this.getPlayerIdsOfRound(round);

    if (!round.isFinished)
      throw new Error(
        "This round hasn't been finished yet. You can not call 'next'."
      );

    const { finalNo } = round;

    if (!Number.isInteger(finalNo)) {
      return this.finishGame(opponentId);
    }

    if (finalNo === 1) {
      return this.finishGame(playingPlayerId);
    }

    return this.createNextRound();
  }

  finishGame(winnerId: Player['id']) {
    console.log('finish game. Winner:', winnerId);
    this.game.winner = winnerId;
    this.game.updateStatus(GameStatus.FINISHED);
  }

  playingPlayerValidation(playerId: Player['id']) {
    return this.details.playing === playerId;
  }

  get rounds() {
    return this.roundCtrl.allRounds;
  }

  get details() {
    return {
      id: this.game.id,
      players: this.game.players,
      rounds: this.rounds,
      status: this.game.status,
      playing: this.roundCtrl.playingPlayer,
      number: this.roundCtrl.currentNo,
      winner: this.game.winner,
    };
  }
}
