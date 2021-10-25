import express, { Request, Response, NextFunction } from 'express'

import ValidationError from '../utils/errors/validation-error'

import { gameService } from '../services/game'

const router = express.Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const games = await gameService.getAllGames()
    res.status(200).json({ games: games.map((game) => game.instance) })
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  try {
    const game = await gameService.getGameById(id)
    res.status(200).json({ game: game.instance })
  } catch (error) {
    next(error)
  }
})

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
    const { playerId } = req.body

    try {
      if (!playerId) throw new ValidationError('Player Id missing.')

      const game = await gameService.joinGame(playerId)

      res.status(200).json({ game: game.instance })
    } catch (error) {
      next(error)
    }
  }
)

export default router
