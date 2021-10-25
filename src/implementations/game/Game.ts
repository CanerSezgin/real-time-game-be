import GameSelection from '../../entities/types/GameSelection';
import GameStatus from '../../entities/types/GameStatus';
import Player from '../../entities/types/Player';
import generateUniqueId from '../../utils/generateUniqueId';
import generateRandomNumber from '../../utils/generateRandomNumber';

// Change with abstracts
import GameController from './GameController';
import RoundController from './RoundController';

export default class Game {
  readonly id: string = generateUniqueId('GM-');
  createdAt: Date = new Date();
  status = GameStatus.PENDING;
  players: [Player['id'] | null, Player['id'] | null] = [null, null];
  initNo: number = /* generateRandomNumber(50, 250) */ 70;
  winner: Player['id'] | null = null;
  gameCtrl = new GameController(this, new RoundController());

  updateStatus(status: GameStatus): void {
    this.status = status;
  }

  sitP1Seat(pId: Player['id']): void {
    if (this.players[0]) throw Error('P1 Seat is occupied.');
    this.players[0] = pId;
  }

  sitP2Seat(pId: Player['id']): void {
    if (this.players[1]) throw Error('P2 Seat is occupied.');
    this.players[1] = pId;
  }

  start(): void {
    this.updateStatus(GameStatus.ACTIVE);
    this.gameCtrl.createNextRound();
  }

  select(selection: GameSelection) {
    this.gameCtrl.select(selection);
    this.gameCtrl.next();
  }

  get isFinished() {
    return this.status === GameStatus.FINISHED;
  }

  get isPending() {
    return this.status === GameStatus.PENDING;
  }
}


/* const game = new GameWithState();
game.joinGame('p1 id here');
game.joinGame('p2 id here');
game.joinGame('p2 id here');
game.play(GameSelection.decrease);
game.play(GameSelection.increase);
game.play(GameSelection.increase);
game.play(GameSelection.stay);
game.play(GameSelection.decrease);
console.log(game.gameCtrl.rounds); */