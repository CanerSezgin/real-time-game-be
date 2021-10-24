import Player from '../entities/types/Player';
import IRound from '../entities/interfaces/round';
import GameSelection from '../entities/types/GameSelection';

type Nullable<T> = T | undefined | null;

class Round implements IRound {
  public selection: Nullable<GameSelection>;
  public finalNo: Nullable<number>;

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
    return this.selection != null;
  }
}

export default Round;
