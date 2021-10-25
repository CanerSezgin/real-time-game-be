import GameSelection from '../../entities/types/GameSelection'
import Player from '../../entities/types/Player'
import IGameState from '../../entities/interfaces/gameState'

import {
  NoPlayerState,
  HasOnePlayerState,
  GameIsStarted,
  GameIsFinishedState,
} from './gameStates'
import Game from './Game'

export default class GameWithState extends Game {
  private noPlayer: IGameState
  private hasOnePlayer: IGameState
  private gameIsStarted: IGameState
  private gameIsFinished: IGameState

  private state: IGameState

  constructor() {
    super()
    this.noPlayer = new NoPlayerState(this)
    this.hasOnePlayer = new HasOnePlayerState(this)
    this.gameIsStarted = new GameIsStarted(this)
    this.gameIsFinished = new GameIsFinishedState(this)
    this.state = this.noPlayer
  }

  public setState(newState: IGameState) {
    this.state = newState
  }

  public joinGame(playerId: Player['id']) {
    this.state.joinGame(playerId)
  }

  public play(selection: GameSelection) {
    this.state.play(selection)
  }

  get states() {
    return {
      noPlayer: this.noPlayer,
      hasOnePlayer: this.hasOnePlayer,
      gameIsStarted: this.gameIsStarted,
      gameIsFinished: this.gameIsFinished,
    }
  }
}
