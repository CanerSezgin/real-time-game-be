import GameSelection from '../../entities/types/GameSelection';
import Player from '../../entities/types/Player';
import GameState from '../../entities/interfaces/gameState';
import {
  NoPlayerState,
  HasOnePlayerState,
  GameIsStarted,
  GameIsFinishedState,
} from './gameStates';
import Game from './Game';

export default class GameWithState extends Game {
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
