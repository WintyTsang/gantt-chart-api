/** @format */

import { Request, Response } from "express";
import {
  getTrips,
  getGroundTimes,
  calculateGroundTimes,
  createGroundTimeData,
} from "../services/flightService";

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
    res.status(500).json({ message: "Failed to fetch trips" });
  }
};

const getGroundTimesHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  const query: TripPayload = {
    ...req.query,
  };

  // await getTripByQueryPayloadSchema.validate(req.query);
  try {
    const data = await getGroundTimes({ ...query });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trips" });
  }
};

// Lambda function -> create group time data
const lambdaGroundTimeHandler = async (req: Request, res: Response) => {
  try {
    const query: TripPayload = {
      ...req.query,
    };
    const trips = await getTrips(query);
    const groundTime = await calculateGroundTimes(trips);
    const result = await createGroundTimeData(groundTime.groundList);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error creating ground time data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export { getTripsHandler, getGroundTimesHandler, lambdaGroundTimeHandler };
