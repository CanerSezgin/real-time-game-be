import GameSelection from '../entities/types/GameSelection';
import GameStatus from '../entities/types/GameStatus';
import Player from '../entities/types/Player';
import generateUniqueId from '../utils/generateUniqueId';
import generateRandomNumber from '../utils/generateRandomNumber';

import Round from './round';
import { RoundController } from './GameController2';

export interface GameState {
  joinGame(playerId: Player['id']): void;
  play(selection: GameSelection): void;
}

/* 
    States

    hasOnePlayer
    gameIsStarted
    gameIsFinished
*/

class GameController3 {
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
      winner: this.game.winner
    };
  }
}

export class Game {
  readonly id: string = generateUniqueId('GM-');
  createdAt: Date = new Date();
  status = GameStatus.PENDING;
  players: [Player['id'] | null, Player['id'] | null] = [null, null];
  initNo: number = /* generateRandomNumber(50, 250) */ 70;
  winner: Player['id'] | null = null;
  gameCtrl = new GameController3(this, new RoundController());

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

export class GameWithState extends Game {
  private noPlayer: GameState;
  private hasOnePlayer: GameState;
  private gameIsStarted: GameState;
  private gameIsFinished: GameState;

  private state: GameState;

  constructor() {
    super();
    this.noPlayer = new NoPlayerState(this);
    this.hasOnePlayer = new HasOnePlayerState(this);
    this.gameIsStarted = new GameIsStarted(this);
    this.gameIsFinished = new GameIsFinishedState(this);
    this.state = this.noPlayer;
  }

  public setState(newState: GameState) {
    this.state = newState;
  }

  public joinGame(playerId: Player['id']) {
    this.state.joinGame(playerId);
  }

  public play(selection: GameSelection) {
    this.state.play(selection);
  }

  get states() {
    return {
      noPlayer: this.noPlayer,
      hasOnePlayer: this.hasOnePlayer,
      gameIsStarted: this.gameIsStarted,
      gameIsFinished: this.gameIsFinished,
    };
  }
}

export class NoPlayerState implements GameState {
  constructor(public game: GameWithState) {}

  joinGame(playerId: string): void {
    this.game.sitP1Seat(playerId);
    console.log('NoPlayerState | joinGame >> p1 joined.', this.game);
    this.game.setState(this.game.states.hasOnePlayer);
    console.log('NoPlayerState | joinGame >> State set to hasOnePlayer');
  }
  play(selection: GameSelection): void {
    console.log("No Player in the game. Can't be played.");
  }
}

export class HasOnePlayerState implements GameState {
  constructor(public game: GameWithState) {}

  joinGame(playerId: string): void {
    this.game.sitP2Seat(playerId);
    console.log('HasOnePlayerState | joinGame >> p2 joined.', this.game);

    this.game.start();
    console.log('HasOnePlayerState | joinGame >> Game started');

    this.game.setState(this.game.states.gameIsStarted);
    console.log('HasOnePlayerState | joinGame >> State set to GameIsStarted');
  }

  play(selection: GameSelection): void {
    console.log("Only one player in the game. Can't be played.");
  }
}

export class GameIsStarted implements GameState {
  constructor(public game: GameWithState) {}

  joinGame(playerId: string): void {
    console.log(
      'GameIsStarted | joinGame >> Table is already full. Do nothing.'
    );
  }
  play(selection: GameSelection): void {
    this.game.select(selection);
    if (this.game.isFinished) {
      this.game.setState(this.game.states.gameIsFinished);
    }
  }
}
export class GameIsFinishedState implements GameState {
  constructor(public game: GameWithState) {}

  joinGame(playerId: string): void {
    console.log(
      'GameIsStarted | joinGame >> Table is already full. Do nothing.'
    );
  }
  play(selection: GameSelection): void {
    console.log("game's finished. Can't be played.");
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
