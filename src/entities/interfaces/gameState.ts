import Player from '../types/Player'
import GameSelection from '../types/GameSelection'

export default interface IGameState {
  joinGame(playerId: Player['id']): void;
  play(selection: GameSelection): void;
}
