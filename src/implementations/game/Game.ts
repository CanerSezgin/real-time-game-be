import GameSelection from '../../entities/types/GameSelection'
import GameStatus from '../../entities/types/GameStatus'
import Player from '../../entities/types/Player'
import IGame from '../../entities/interfaces/game'
import IRound from '../../entities/interfaces/round'

import generateUniqueId from '../../utils/generateUniqueId'
import generateRandomNumber from '../../utils/generateRandomNumber'

import RoundController from './RoundController'

export default class Game implements IGame {
  public readonly id: string = generateUniqueId('GM-')
  private readonly createdAt: Date = new Date()
  private status = GameStatus.PENDING
  private players: [Player['id'] | null, Player['id'] | null] = [null, null]
  private initNo: number = /* generateRandomNumber(50, 250) */ 70
  private winner: Player['id'] | null = null
  private roundCtrl = new RoundController()

  public sitP1Seat(pId: Player['id']): void {
    if (this.players[0]) throw Error('P1 Seat is occupied.')
    this.players[0] = pId
  }

  public sitP2Seat(pId: Player['id']): void {
    if (this.players[1]) throw Error('P2 Seat is occupied.')
    this.players[1] = pId
  }

  public playRound(selection: GameSelection) {
    this.select(selection)
    this.next()
  }

  public start(): void {
    this.updateStatus(GameStatus.ACTIVE)
    this.createNextRound()
  }

  public playingPlayerValidation(playerId: Player['id']) {
    return this.instance.playing === playerId
  }

  public isThisPlayerOnTable(playerId: Player['id']){
    return this.players.includes(playerId)
  }

  private updateStatus(status: GameStatus): void {
    this.status = status
  }

  private createNextRound() {
    if (this.status !== GameStatus.ACTIVE) {
      throw new Error('Game is not active. Round couldn\'t be created.')
    }

    const currentRound = this.roundCtrl.currentRound

    if (!currentRound) {
      // Create First Round
      return this.roundCtrl.createRound(this.initNo, this.players[0]!)
    } else {
      if (!currentRound.finalNo) {
        throw Error(
          'There is already unfinished round. You can not create next round until it is done.'
        )
      }

      return this.roundCtrl.createRound(
        currentRound.finalNo,
        this.getPlayerIdsOfRound(currentRound).opponentId
      )
    }
  }

  private getPlayerIdsOfRound(round: IRound) {
    const { playerId: playingPlayerId } = round
    const opponentId =
      playingPlayerId === this.players[0] ? this.players[1]! : this.players[0]!

    return {
      playingPlayerId,
      opponentId,
    }
  }

  private getCurrentRound() {
    const { currentRound } = this.roundCtrl
    if (!currentRound)
      throw new Error('Current Round not found in game controller.')

    return currentRound
  }

  private select(selection: GameSelection) {
    const round = this.getCurrentRound()
    const finalNo = (round.startNo + selection) / 3
    round.saveResults(selection, finalNo)
    return round
  }

  private next() {
    const round = this.getCurrentRound()
    const { opponentId, playingPlayerId } = this.getPlayerIdsOfRound(round)

    if (!round.isFinished)
      throw new Error(
        'This round hasn\'t been finished yet. You can not call \'next\'.'
      )

    const { finalNo } = round

    if (!Number.isInteger(finalNo)) {
      return this.finish(opponentId)
    }

    if (finalNo === 1) {
      return this.finish(playingPlayerId)
    }

    return this.createNextRound()
  }

  private finish(winnerId: Player['id']) {
    this.winner = winnerId
    this.updateStatus(GameStatus.FINISHED)
  }

  get isFinished() {
    return this.status === GameStatus.FINISHED
  }

  get isPending() {
    return this.status === GameStatus.PENDING
  }

  get instance() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      players: this.players,
      rounds: this.roundCtrl.allRounds,
      status: this.status,
      playing: this.roundCtrl.playingPlayer,
      number: this.roundCtrl.currentNo,
      winner: this.winner,
    }
  }
}
