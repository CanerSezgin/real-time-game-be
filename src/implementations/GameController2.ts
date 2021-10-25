import generateUniqueId from '../utils/generateUniqueId';
import GameStatus from '../entities/types/GameStatus';
import Player from '../entities/types/Player';
import Round from './round';
import { LinkedList } from './linkedList';
import GameSelection from '../entities/types/GameSelection';

export class GameTable {
  id: string = generateUniqueId('GM-');
  p1Id: Player['id'] | null = null;
  p2Id: Player['id'] | null = null;
  initNo: number | null = null;
  status: GameStatus = GameStatus.PENDING;
  winner: Player['id'] | null = null;
  resultMessage: string = '';
  createdAt: Date;

  constructor() {
    this.createdAt = new Date();
  }
  updateStatus(status: GameStatus): void {
    this.status = status;
  }
  assignP2Id(pId: Player['id']): void {
    this.p2Id = pId;
  }

  sitP1Seat(pId: Player['id']): void {
    if (this.p1Id) throw Error('P1 Seat is occupied.');
    this.p1Id = pId;
  }
  sitP2Seat(pId: Player['id']): void {
    if (this.p1Id) throw Error('P2 Seat is occupied.');
    this.p2Id = pId;
  }

  saveGameResult(winner: Player['id'], resultMessage: string): void {
    this.winner = winner;
    this.resultMessage = resultMessage;
    this.updateStatus(GameStatus.FINISHED);
  }
}

export class RoundController {
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

export class GameController {
  private startAt: Date;
  private endAt: Date | null = null;

  constructor(
    private gameTable: GameTable,
    private RoundController: RoundController,
    p2Id: Player['id']
  ) {
    this.gameTable.assignP2Id(p2Id);
    this.createNextRound();
    this.startAt = new Date();
  }

  createNextRound() {
    const currentRound = this.RoundController.currentRound;

    if (!currentRound) {
      // Create First Round
      return this.RoundController.createRound(
        this.gameTable.initNo!,
        this.gameTable.p1Id!
      );
    } else {
      if (!currentRound.finalNo) {
        throw Error(
          'There is already unfinished round. You can not create next round until it is done.'
        );
      }

      return this.RoundController.createRound(
        currentRound.finalNo,
        this.getOpponentIdOfCurrentRound()!
      );
    }
  }

  select(selection: GameSelection) {
    const currentRound = this.RoundController.currentRound!;
    const { startNo } = currentRound;
    const finalNo = (startNo + selection) / 3;
    currentRound.saveResults(selection, finalNo);
  }

  getOpponentIdOfCurrentRound() {
    const currentRound = this.RoundController.currentRound!;
    return currentRound.playerId === this.gameTable.p1Id
      ? this.gameTable.p2Id!
      : this.gameTable.p1Id;
  }

  checkRoundResult() {
    const currentRound = this.RoundController.currentRound!;
    const finalNo = currentRound.finalNo!;
    const opponentId = this.getOpponentIdOfCurrentRound();

    if (!Number.isInteger(finalNo)) {
      const msg = `Player (${currentRound.playerId}) selected wrong option. Player (${opponentId}) won the game in Round: ${this.RoundController.noOfRounds}`;
      return this.finishGame(opponentId!, msg);
    }

    if (finalNo === 1) {
      const msg = `Player (${currentRound.playerId}) won the game by reaching to 1 after ${this.RoundController.noOfRounds} rounds.`;
      return this.finishGame(currentRound.playerId, msg);
    }

    return this.createNextRound();
  }

  finishGame(winner: Player['id'], resultMessage: string) {
    this.gameTable.saveGameResult(winner, resultMessage);
    this.endAt = new Date();
  }

  get rounds() {
    return this.RoundController.allRounds;
  }

  get game() {
    return {
      ...this.gameTable,
      rounds: this.rounds,
      startAt: this.startAt,
      endAt: this.endAt,
    };
  }
}

/* const gameCtrl = new GameController(
  new GameTable('p1:123', 38),
  new RoundController(),
  'p2:456'
);

console.log(gameCtrl.rounds);

gameCtrl.select(GameSelection.increase);
gameCtrl.checkRoundResult();
console.log(gameCtrl.rounds);
console.log(gameCtrl.game);

gameCtrl.select(GameSelection.decrease);
gameCtrl.checkRoundResult();
console.log(gameCtrl.rounds);
console.log(gameCtrl.game);

gameCtrl.select(GameSelection.decrease);
gameCtrl.checkRoundResult();
console.log(gameCtrl.rounds);
console.log(gameCtrl.game); */
