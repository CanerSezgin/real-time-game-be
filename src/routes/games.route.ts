import express, { Request, Response, NextFunction } from 'express';

import NotFoundError from '../utils/errors/not-found-error';
import ValidationError from '../utils/errors/validation-error';

import { gameService } from '../services/Games';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res
      .status(200)
      .json({ games: gameService.games.map((game) => game.gameCtrl.details) });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const game = gameService.getGameById(id);
    if (!game) throw new NotFoundError(`Game Not Found with ID: ${id}`);
    res.status(200).json({ game: game.gameCtrl.details });
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

      const game = gameService.joinGame(playerId);

      res.status(200).json({ game: game.gameCtrl.details });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
