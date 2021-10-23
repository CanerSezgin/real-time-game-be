import GameSelection from '../entities/types/GameSelection';
import Player from '../entities/types/Player';

export interface GameState {
  joinToGame(playerId: Player['id']): void;
  makeSelection(playerId: Player['id'], selection: GameSelection): void;
}

/* 
    States

    hasOnePlayer
    hasTwoPlayer
    gameIsRunning
    gameIsFinished
*/

export class Game {
  private noPlayer: GameState;
  private hasOnePlayer: GameState;
  private hasTwoPlayer: GameState;
  private gameIsRunning: GameState;
  private gameIsFinished: GameState;

  private state: GameState;

  constructor() {
    this.noPlayer = new NoPlayerState(this);
    this.hasOnePlayer = new HasOnePlayerState(this);
    this.hasTwoPlayer = new HasTwoPlayerState(this);
    this.gameIsRunning = new GameIsRunningState(this);
    this.gameIsFinished = new GameIsFinishedState(this);
    this.state = this.noPlayer;
  }

  public setState(newState: GameState) {
    this.state = newState;
  }

  public joinToGame(playerId: Player['id']) {
    this.state.joinToGame(playerId);
  }

  public makeSelection(playerId: Player['id'], selection: GameSelection) {
    this.state.makeSelection(playerId, selection);
  }

  get states() {
    return {
      noPlayer: this.noPlayer,
      hasOnePlayer: this.hasOnePlayer,
      hasTwoPlayer: this.hasTwoPlayer,
      gameIsRunning: this.gameIsRunning,
      gameIsFinished: this.gameIsFinished,
    };
  }
}

export class NoPlayerState implements GameState {
  constructor(public game: Game) {}

  joinToGame(playerId: string): void {
    this.game.setState(this.game.states.hasOnePlayer);
  }
  makeSelection(playerId: string, selection: GameSelection): void {
    throw new Error('Method not implemented.');
  }
}

export class HasOnePlayerState implements GameState {
  constructor(public game: Game) {}

  joinToGame(playerId: string): void {
    throw new Error('Method not implemented.');
  }
  makeSelection(playerId: string, selection: GameSelection): void {
    throw new Error('Method not implemented.');
  }
}

export class HasTwoPlayerState implements GameState {
  constructor(public game: Game) {}

  joinToGame(playerId: string): void {
    throw new Error('Method not implemented.');
  }
  makeSelection(playerId: string, selection: GameSelection): void {
    throw new Error('Method not implemented.');
  }
}
export class GameIsRunningState implements GameState {
  constructor(public game: Game) {}

  joinToGame(playerId: string): void {
    throw new Error('Method not implemented.');
  }
  makeSelection(playerId: string, selection: GameSelection): void {
    throw new Error('Method not implemented.');
  }
}
export class GameIsFinishedState implements GameState {
  constructor(public game: Game) {}

  joinToGame(playerId: string): void {
    throw new Error('Method not implemented.');
  }
  makeSelection(playerId: string, selection: GameSelection): void {
    throw new Error('Method not implemented.');
  }
}
