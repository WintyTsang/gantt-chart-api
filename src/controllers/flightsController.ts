/** @format */

import { Request, Response } from 'express';
import { getTrips, getGroundTimes } from '../services/flightService';

interface TripPayload {
  planIds?: string[] | string;
  origin?: string | string[];
  destination?: string | string[];
}

const getTripsHandler = async (req: Request, res: Response): Promise<any> => {

  const query: TripPayload = {
    ...req.query,
};
  // await getTripByQueryPayloadSchema.validate(req.query);
  try {
    const data = await getTrips({ ...query });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch trips' });
  }
};

const getGroundTimesHandler = async (req: Request, res: Response): Promise<any> => {

  const query: TripPayload = {
    ...req.query,
};

  // await getTripByQueryPayloadSchema.validate(req.query);
  try {
    const data = await getGroundTimes({ ...query });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch trips' });
  }
};

export { getTripsHandler, getGroundTimesHandler };
