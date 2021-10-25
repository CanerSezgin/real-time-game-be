import GameSelection from '../../entities/types/GameSelection'
import IGameState from '../../entities/interfaces/gameState'
import GameWithState from './GameWithState'

export class NoPlayerState implements IGameState {
  constructor(public game: GameWithState) {}

  joinGame(playerId: string): void {
    this.game.sitP1Seat(playerId)
    console.log('NoPlayerState | joinGame >> p1 joined.', this.game.id)
    this.game.setState(this.game.states.hasOnePlayer)
    console.log('NoPlayerState | joinGame >> State set to hasOnePlayer')
  }
  play(selection: GameSelection): void {
    console.log('No Player in the game. Can\'t be played.')
  }
}

export class HasOnePlayerState implements IGameState {
  constructor(public game: GameWithState) {}

  joinGame(playerId: string): void {
    this.game.sitP2Seat(playerId)
    console.log('HasOnePlayerState | joinGame >> p2 joined.', this.game.id)

    this.game.start()
    console.log('HasOnePlayerState | joinGame >> Game started')

    this.game.setState(this.game.states.gameIsStarted)
    console.log('HasOnePlayerState | joinGame >> State set to GameIsStarted')
  }

  play(selection: GameSelection): void {
    console.log('Only one player in the game. Can\'t be played.')
  }
}

export class GameIsStarted implements IGameState {
  constructor(public game: GameWithState) {}

  joinGame(playerId: string): void {
    console.log(
      'GameIsStarted | joinGame >> Table is already full. Do nothing.'
    )
  }
  play(selection: GameSelection): void {
    this.game.playRound(selection)
    if (this.game.isFinished) {
      this.game.setState(this.game.states.gameIsFinished)
    }
  }
}
export class GameIsFinishedState implements IGameState {
  constructor(public game: GameWithState) {}

  joinGame(playerId: string): void {
    console.log(
      'GameIsStarted | joinGame >> Table is already full. Do nothing.'
    )
  }
  play(selection: GameSelection): void {
    console.log('game\'s finished. Can\'t be played.')
  }
}
