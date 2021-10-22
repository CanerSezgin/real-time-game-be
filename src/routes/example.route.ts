import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ status: 'ok', msg: 'example-rest-api-route' });
  } catch (error) {
    next(error);
  }
});

export default router;
