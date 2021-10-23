import Player from '../entities/types/Player';
import IRound from '../entities/interfaces/round';
import GameSelection from '../entities/types/GameSelection';

class Round implements IRound {
  public selection: GameSelection | null = null;
  public finalNo: number | null = null;

  constructor(
    public readonly id: number,
    public readonly startNo: number,
    public readonly playerId: Player['id']
  ) {}

  saveResults(selection: GameSelection, finalNo: number) {
    this.selection = selection;
    this.finalNo = finalNo;
  }

  get isFinished() {
    return !!this.selection;
  }
}

export default Round;
