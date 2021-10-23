import generateUniqueId from '../utils/generateUniqueId';
import GameStatus from '../entities/types/GameStatus';
import Player from '../entities/types/Player';
import Round from './round';
import { LinkedList } from './linkedList';

export default class Game {
  id: string = generateUniqueId('GM-');
  p2Id: string | null = null;
  rounds: Round[] = [];
  status: GameStatus = GameStatus.PENDING;

  constructor(public p1Id: Player['id'], public initNo: number) {}
}

export class RoundsController {
  private rounds: Round[] = [];

  insertRound(round: Round): void {
    this.rounds.push(round);
  }

  get allRounds() {
    return this.rounds;
  }

  get currentRound(): Round | null {
    return this.rounds[this.noOfRounds] || null;
  }

  get noOfRounds() {
    return this.rounds.length;
  }
}
