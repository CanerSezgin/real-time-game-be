import Player from "../types/Player";
import GameSelection from "../types/GameSelection";

export default interface GameState {
  joinGame(playerId: Player['id']): void;
  play(selection: GameSelection): void;
}
