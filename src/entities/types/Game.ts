import Player from './Player';
import Round from './Round';
import GameStatus from './GameStatus';

type Game = {
  id: string;
  p1Id: Player['id'];
  p2Id: Player['id'] | null;
  initNo: number;
  rounds: Round[];
  status: GameStatus;
};
export default Game;
