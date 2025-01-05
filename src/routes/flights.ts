import { Router, Request, Response } from "express";
import { getTripsHandler, getGroundTimesHandler } from '../controllers/flightsController';

const router = Router();

router.get('/', (_: Request, res: Response) => { res.send('Welcome!'); });
router.get('/trips', getTripsHandler);
router.get('/ground-times', getGroundTimesHandler);

export default router;

// TODO: add error handling middleware