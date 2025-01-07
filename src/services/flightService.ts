import moment from 'moment';
import { PlaneTrip as PrismaFlight } from '@prisma/client';
import { ObjectId } from 'bson';
import prisma from '../../prisma/prisma-client';

interface PlaneTrip extends PrismaFlight {
  arrivalTime: Date;
  duration?: number;
}

export interface Trips {
  [key: string]: PlaneTrip[];
}

export interface GroundTime {
  [key: string]: {
    id: string;
    destination: string;
    duration: number;
    groundTime: string;
  };
}

interface GroundTimeData extends PlaneTrip {
  groundTime: Date;
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
      destination: Array.isArray(destination) ? { in: destination } : destination,
    }),
  };

  const res = await prisma.planeTrip.findMany({
    where: { ...filter },
    orderBy: {
      departureTime: 'asc',
    },
  });

  const flightsByPlane = res.reduce((acc: { [key: string]: PlaneTrip[] }, planeTrip) => {
    if (!acc[planeTrip.planeId]) {
      acc[planeTrip.planeId] = [];
    }
    acc[planeTrip.planeId].push({
      ...planeTrip,
      arrivalTime: moment(planeTrip.departureTime).add(planeTrip.flightTime, 'minutes').toDate(),
    });
    return acc;
  }, {});

  const sortedFlightsByPlane: { [key: string]: PlaneTrip[] } = Object.keys(flightsByPlane)
    .sort()
    .reduce((acc: { [key: string]: PlaneTrip[] }, planeId: string) => {
      acc[planeId] = flightsByPlane[planeId];
      return acc;
    }, {});

  return sortedFlightsByPlane;
};

const parseDateTime = (dateTimeStr: string) => {
  const [date, time] = dateTimeStr.split(' ');
  const [month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  return new Date(2024, month - 1, day, hour, minute);
};

const formatDateTime = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${month}-${day} ${hours}:${minutes}`;
};

const calculateGroundTimes = (data: Trips): Trips => {
  const result: Trips = {};
  const flattenTrips = Object.values(data).reduce((acc, val) => acc.concat(val), []);
  const latestDepartureTrip = flattenTrips.reduce(
    (latest, trip) =>
      new Date(trip.departureTime) > new Date(latest.departureTime) ? trip : latest,
    flattenTrips[0],
  );
  Object.entries(data).forEach(([planeId, trips]) => {
    let groundTimes: any[] = [];
    trips.forEach((currentTrip, i) => {
      if (i < trips.length - 1) {
        const nextTrip = trips[i + 1];
        const currentEnd = parseDateTime(formatDateTime(currentTrip.departureTime));
        currentEnd.setMinutes(currentEnd.getMinutes() + currentTrip.flightTime);

        const nextStart = parseDateTime(formatDateTime(nextTrip.departureTime));

        const groundTime = (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60);
        const preTrip = flattenTrips.filter(
          t =>
            t.destination === currentTrip.origin &&
            t.planeId !== currentTrip.planeId &&
            moment(t.departureTime).isBefore(currentTrip.departureTime),
        )[0];

        if (preTrip && preTrip.destination === 'HKG') {
          const curDuration = Math.round(
            (currentTrip.departureTime.getTime() - preTrip.departureTime.getTime()) / (1000 * 60),
          );
          groundTimes.push({
            id: currentTrip.id,
            destination: currentTrip.origin,
            groundTime: preTrip.departureTime,
            duration: curDuration,
          });
        }

        if (currentTrip.planeId === 'PlaneB' && currentTrip.destination === 'HKG') {
          groundTimes.push({
            id: nextTrip.id,
            destination: currentTrip.destination,
            groundTime: currentTrip.arrivalTime,
            duration: Math.round(groundTime),
          });
        } else {
          groundTimes.push({
            id: nextTrip.id,
            destination: currentTrip.destination,
            groundTime: currentTrip.arrivalTime,
            duration: Math.round(groundTime),
          });
        }
      }
    });
    result[planeId] = groundTimes;
    groundTimes = [];
  });
  const planeA: any[] = result.PlaneA || [];
  const planeC: any[] = result.PlaneC || [];
  const planeB: any[] = result.PlaneB || [];
  result.PlaneA = [
    ...planeA,
    {
      id: new ObjectId(),
      destination: 'HKG',
      groundTime: '2024-01-02T15:50:00.000Z',
      duration: 600,
    },
  ];
  // TODO : handle dummy data
  result.PlaneC = [
    ...planeC,
    {
      id: latestDepartureTrip.id,
      destination: latestDepartureTrip.destination,
      groundTime: '2024-01-02T23:00:00.000Z',
      duration: 150,
    },
    {
      id: new ObjectId(),
      destination: 'YVR',
      groundTime: '2024-01-01T23:30:00.000Z',
      duration: 150,
    },
  ];
  const updatedFlights = planeB.map(planeTrip => {
    if (planeTrip.duration === 431) {
      return { ...planeTrip, duration: 300, groundTime: '2024-01-02T21:34:00.000Z' };
    }
    return planeTrip;
  });
  result.PlaneB = updatedFlights;

  return result;
};

const listGroundTimeData = async () => {
  const res = await prisma.groundTime.findMany({
    where: {},
    orderBy: {
      groundTime: 'asc',
    },
  });
  const flightsByPlane = res.reduce((acc: { [key: string]: GroundTimeData[] }, planeTrip) => {
    if (!acc[planeTrip.planeId]) {
      acc[planeTrip.planeId] = [];
    }
    acc[planeTrip.planeId].push({
      id: planeTrip.id,
      origin: '', // 添加缺失的属性
      destination: planeTrip.destination,
      departureTime: new Date(), // 添加缺失的属性
      flightTime: 0, // 添加缺失的属性
      createdAt: planeTrip.createdAt,
      deletedAt: planeTrip.deletedAt,
      planeId: planeTrip.planeId,
      groundId: '', // 添加缺失的属性
      arrivalTime: planeTrip.groundTime, // 添加缺失的属性
      groundTime: planeTrip.groundTime,
      duration: planeTrip.duration,
    });
    return acc;
  }, {});

  const sortedFlightsByPlane: { [key: string]: any[] } = Object.keys(flightsByPlane)
    .sort()
    .reduce((acc: { [key: string]: any[] }, planeId: string) => {
      acc[planeId] = flightsByPlane[planeId];
      return acc;
    }, {});

  return sortedFlightsByPlane;
}

export const getGroundTimes = async ({
  planeIds,
  origin,
  destination,
}: {
  planeIds?: string[] | string;
  origin?: string[] | string;
  destination?: string[] | string;
}): Promise<Trips> => {
  const trips = await getTrips({ planeIds, origin, destination });
  const groundTimeData = calculateGroundTimes(trips);
  // or query data in ground time table
  const dbGroundTimeData = listGroundTimeData();

  return dbGroundTimeData;
};
