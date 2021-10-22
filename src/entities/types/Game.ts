import Player from './Player';
import Round from './Round';

type Game = {
  id: string;
  p1Id: Player['id'];
  p2Id: Player['id'] | null;
  initNo: number;
  rounds: Round[];
};
export default Game;
