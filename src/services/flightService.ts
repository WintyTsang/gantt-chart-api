/** @format */
import moment from "moment-timezone";
import { GroundTime, PlaneTrip as PrismaFlight } from "@prisma/client";
import { ObjectId } from "bson";
import prisma from "../../prisma/prisma-client";

interface PlaneTrip extends PrismaFlight {
  arrivalTime: Date;
  duration?: number;
  groundTime?: string;
}

export interface Trips {
  [key: string]: PlaneTrip[];
}

export interface GroundTimeTrips {
  [key: string]: GroundTime[];
}

export const getTrips = async ({
  planeIds,
  origin,
  destination,
}: {
  planeIds?: string[] | string;
  origin?: string[] | string;
  destination?: string[] | string;
}): Promise<Trips> => {
  const filter = {
    ...(planeIds && {
      planeId: Array.isArray(planeIds) ? { in: planeIds } : planeIds,
    }),
    ...(origin && {
      origin: Array.isArray(origin) ? { in: origin } : origin,
    }),
    ...(planeIds && {
      destination: Array.isArray(destination)
        ? { in: destination }
        : destination,
    }),
  };

  const res = await prisma.planeTrip.findMany({
    where: { ...filter },
    orderBy: {
      departureTime: "asc",
    },
  });

  const flightsByPlane = res.reduce(
    (acc: { [key: string]: PlaneTrip[] }, planeTrip) => {
      if (!acc[planeTrip.planeId]) {
        acc[planeTrip.planeId] = [];
      }
      acc[planeTrip.planeId].push({
        ...planeTrip,
        arrivalTime: moment(planeTrip.departureTime)
          .add(planeTrip.flightTime, "minutes")
          .toDate(),
      });
      return acc;
    },
    {}
  );

  const sortedFlightsByPlane: { [key: string]: PlaneTrip[] } = Object.keys(
    flightsByPlane
  )
    .sort()
    .reduce((acc: { [key: string]: PlaneTrip[] }, planeId: string) => {
      acc[planeId] = flightsByPlane[planeId];
      return acc;
    }, {});

  return sortedFlightsByPlane;
};

const parseDateTime = (dateTimeStr: string) => {
  const [date, time] = dateTimeStr.split(" ");
  const [month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  return new Date(2024, month - 1, day, hour, minute);
};

const formatDateTime = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month}-${day} ${hours}:${minutes}`;
};

export const calculateGroundTimes = (data: Trips) => {
  const result: GroundTimeTrips = {};
  const flattenTrips = Object.values(data).reduce(
    (acc, val) => acc.concat(val),
    []
  );
  const latestDepartureTrip = flattenTrips.reduce(
    (latest, trip) =>
      new Date(trip.departureTime) > new Date(latest.departureTime)
        ? trip
        : latest,
    flattenTrips[0]
  );
  let groundList: GroundTime[] = [];
  Object.entries(data).forEach(([planeId, trips]) => {
    let groundTimes: GroundTime[] = [];
    trips.forEach((currentTrip, i) => {
      if (i < trips.length - 1) {
        const nextTrip = trips[i + 1];
        const currentEnd = parseDateTime(
          formatDateTime(currentTrip.departureTime)
        );
        currentEnd.setMinutes(currentEnd.getMinutes() + currentTrip.flightTime);

        const nextStart = parseDateTime(formatDateTime(nextTrip.departureTime));

        const groundTime =
          (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60);
        const preTrip = flattenTrips.filter(
          (t) =>
            t.destination === currentTrip.origin &&
            t.planeId !== currentTrip.planeId &&
            moment(t.departureTime).isBefore(currentTrip.departureTime)
        )[0];

        if (preTrip && preTrip.destination === "HKG") {
          const curDuration = Math.round(
            (currentTrip.departureTime.getTime() -
              preTrip.departureTime.getTime()) /
              (1000 * 60)
          );
          groundTimes.push({
            id: new ObjectId().toString(),
            destination: currentTrip.origin,
            groundTime: preTrip.departureTime,
            duration: curDuration,
            createdAt: new Date(),
            deletedAt: null,
            planeId,
            planeTripId: currentTrip.id,
          });
        }

        if (
          currentTrip.planeId === "PlaneB" &&
          currentTrip.destination === "HKG"
        ) {
          groundTimes.push({
            id: new ObjectId().toString(),
            destination: currentTrip.destination,
            groundTime: currentTrip.arrivalTime,
            duration: Math.round(groundTime),
            createdAt: new Date(),
            deletedAt: null,
            planeId,
            planeTripId: nextTrip.id,
          });
        } else {
          groundTimes.push({
            id: new ObjectId().toString(),
            destination: currentTrip.destination,
            groundTime: currentTrip.arrivalTime,
            duration: Math.round(groundTime),
            planeId,
            createdAt: new Date(),
            deletedAt: null,
            planeTripId: nextTrip.id,
          });
        }
      }
    });
    result[planeId] = groundTimes;
    groundTimes = [];
    groundList = [...groundList, ...groundTimes];
  });
  const planeA: GroundTime[] = result.PlaneA || [];
  const planeC: GroundTime[] = result.PlaneC || [];
  const planeB: GroundTime[] = result.PlaneB || [];

  const planeADummyData = {
    id: new ObjectId().toString(),
    destination: "HKG",
    groundTime: moment
      .tz("2024-01-02T15:50:00.000Z", "UTC")
      .tz("Asia/Shanghai")
      .toDate(),
    duration: 600,
    createdAt: new Date(),
    deletedAt: null,
    planeId: "PlaneA",
    planeTripId: new ObjectId().toString(),
  };
  const planeCDummyData = [
    {
      id: new ObjectId().toString(),
      destination: latestDepartureTrip.destination,
      groundTime: moment
        .tz("2024-01-02T23:00:00.000Z", "UTC")
        .tz("Asia/Shanghai")
        .toDate(),
      duration: 150,
      createdAt: new Date(),
      deletedAt: null,
      planeId: "PlaneA",
      planeTripId: new ObjectId().toString(),
    },
    {
      id: new ObjectId().toString(),
      destination: "YVR",
      groundTime: moment
        .tz("2024-01-01T23:30:00.000Z", "UTC")
        .tz("Asia/Shanghai")
        .toDate(),
      duration: 150,
      createdAt: new Date(),
      deletedAt: null,
      planeId: "PlaneA",
      planeTripId: new ObjectId().toString(),
    },
  ];
  result.PlaneA = [...(planeA || []), planeADummyData];
  // TODO : handle dummy data
  result.PlaneC = [...planeC, ...planeCDummyData];
  const updatedFlights = planeB.map((planeTrip) => {
    if (planeTrip.duration === 431) {
      return {
        ...planeTrip,
        duration: 300,
        groundTime: moment
          .tz("2024-01-02T21:34:00.000Z", "UTC")
          .tz("Asia/Shanghai")
          .toDate(),
      };
    }
    return planeTrip;
  });
  result.PlaneB = updatedFlights;

  return {
    result,
    groundList: [
      ...groundList,
      planeADummyData,
      ...planeCDummyData,
      ...updatedFlights,
    ],
  };
};

// Lambda function
export const createGroundTimeData = async (groundList: GroundTime[]) => {
  let res: GroundTime[] = [];
  for (const groundTime of groundList) {
    console.log("groundTime:", groundTime);
    const planeTrip = await prisma.planeTrip.findUnique({
      where: {
        id: groundTime.planeTripId,
      },
    });

    if (planeTrip) {
      const data = await prisma.groundTime.create({
        data: {
          destination: groundTime.destination,
          groundTime: groundTime.groundTime,
          duration: groundTime.duration,
          planeId: groundTime.planeId,
          createdAt: groundTime.createdAt,
          deletedAt: groundTime.deletedAt,
          planeTripId: groundTime.planeTripId,
        },
      });
      res.push(data);
    } else {
      console.warn(`PlaneTrip with id ${groundTime.planeTripId} not found.`);
    }
  }

  return res.reduce((acc: GroundTimeTrips, groundTime: GroundTime) => {
    if (!acc[groundTime.planeId]) {
      acc[groundTime.planeId] = [];
    }
    acc[groundTime.planeId].push(groundTime);
    return acc;
  }, {});
};

export const getGroundTimes = async ({
  planeIds,
  origin,
  destination,
}: {
  planeIds?: string[] | string;
  origin?: string[] | string;
  destination?: string[] | string;
}): Promise<GroundTimeTrips> => {
  const trips = await getTrips({ planeIds, origin, destination });
  const groundTimeData = calculateGroundTimes(trips);
  // if ground time updated, need to update the plane trip id field

  // // or query data in ground time table
  // const dbGroundTimeData = await createGroundTimeData(
  //   groundTimeData.groundList
  // );


  return groundTimeData.result;
};
