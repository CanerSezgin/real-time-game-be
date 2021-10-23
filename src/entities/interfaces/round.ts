import Player from '../types/Player';

export default interface IRound {
  id: number;
  startNo: number;
  playerId: Player['id'];
  selection: any
}
