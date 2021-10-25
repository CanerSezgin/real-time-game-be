import Player from '../../entities/types/Player'
import IRound from '../../entities/interfaces/round'
import GameSelection from '../../entities/types/GameSelection'
import Nullable from '../../entities/types/Nullable'

export default class Round implements IRound {
  public selection: Nullable<GameSelection>
  public finalNo: Nullable<number>

  constructor(
    public readonly id: number,
    public readonly startNo: number,
    public readonly playerId: Player['id']
  ) {}

  saveResults(selection: GameSelection, finalNo: number) {
    this.selection = selection
    this.finalNo = parseFloat(finalNo.toFixed(2))
  }

  get isFinished() {
    return this.selection != null
  }
}
