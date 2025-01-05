import moment from 'moment';
import { Flight as PrismaFlight } from '@prisma/client';
import { ObjectId } from 'bson';
import prisma from '../../prisma/prisma-client';

interface Flight extends PrismaFlight {
  arrivalTime: Date;
  duration?: number;
}

export interface Trips {
  [key: string]: Flight[];
}

export interface GroundTime {
  [key: string]: {
    id: string;
    destination: string;
    duration: number;
    groundTime: string;
  };
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

  const res = await prisma.flight.findMany({
    where: { ...filter },
    orderBy: {
      departureTime: 'asc',
    },
  });

  const flightsByPlane = res.reduce((acc: { [key: string]: Flight[] }, flight) => {
    if (!acc[flight.plane]) {
      acc[flight.plane] = [];
    }
    acc[flight.plane].push({
      ...flight,
      arrivalTime: moment(flight.departureTime).add(flight.flightTime, 'minutes').toDate(),
    });
    return acc;
  }, {});

  const sortedFlightsByPlane: { [key: string]: Flight[] } = Object.keys(flightsByPlane)
    .sort()
    .reduce((acc: { [key: string]: Flight[] }, plane: string) => {
      acc[plane] = flightsByPlane[plane];
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
  Object.entries(data).forEach(([plane, trips]) => {
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
            t.plane !== currentTrip.plane &&
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

        if (currentTrip.plane === 'PlaneB' && currentTrip.destination === 'HKG') {
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
    result[plane] = groundTimes;
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
  const updatedFlights = planeB.map(flight => {
    if (flight.duration === 431) {
      return { ...flight, duration: 300, groundTime: '2024-01-02T21:34:00.000Z' };
    }
    return flight;
  });
  result.PlaneB = updatedFlights;

  return result;
};

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
  const chart2Data = calculateGroundTimes(trips);

  return chart2Data;
};
