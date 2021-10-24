import express, { Request, Response, NextFunction } from 'express';
import Player from '../entities/types/Player';
import { Game, GameWithState } from '../implementations/Game3';
import NotFoundError from '../utils/errors/not-found-error';
import ValidationError from '../utils/errors/validation-error';

const router = express.Router();

class Games {
  games: GameWithState[] = [];

  getGameById(id: Game['id']) {
    return this.games.find((game) => game.id === id);
  }

  joinGame(playerId: Player['id']) {
    const game = this.getAPendingGame() || this.createAGame();
    game.joinGame(playerId);
    return game;
  }

  private createAGame() {
    const game = new GameWithState();
    this.games.push(game);
    return game;
  }

  private getAPendingGame() {
    return this.games.find((game) => game.isPending);
  }
}

const games = new Games();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ games: games.games });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const game = games.getGameById(id);
    if (!game) throw new NotFoundError(`Game Not Found with ID: ${id}`);
    res.status(200).json({ game });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/join',
  async (req: Request, res: Response, next: NextFunction) => {
    /**
     * Note that:
     * jwt or session based auth system shpuld be implemented.
     * after this implementation playerId can be extracted from token/session.
     * for the sake of simplicity this part is skipped and asking client to provide
     * playerId explicitly.
     *
     *
     * const authHeader = req.headers['authorization']
     * const token = authHeader && authHeader.split(' ')[1]
     * verify token --> get playerId
     */
    const { playerId } = req.body;

    try {
      if (!playerId) throw new ValidationError('Player Id missing.');

      const game = games.joinGame(playerId);

      res.status(200).json({ game });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
