import moment from "moment-timezone";
import { ObjectId } from "bson";
import prisma from './prisma-client';

const main = async () => {
  // eslint-disable-next-line no-console
  console.log('Seeding Database');

  try {
    console.log('Creating flight data...');
    await prisma.flight.createMany({
      data: [
        {
          origin: 'HKG',
          destination: 'NRT',
          departureTime: moment.tz("2024-01-02 01:25", "UTC").tz("Asia/Shanghai").toDate(),
          flightTime: 270,
          plane: 'PlaneA' ,
        },
        {
          origin: 'NRT',
          destination: 'TPE',
          departureTime: moment.tz("2024-01-02 08:39", "UTC").tz("Asia/Shanghai").toDate(),
          flightTime: 230,
          plane: 'PlaneA' ,
        },
        {
          origin: 'TPE',
          destination: 'HKG',
          departureTime: moment.tz("2024-01-02 13:50", "UTC").tz("Asia/Shanghai").toDate(),
          flightTime: 120,
          plane: 'PlaneA' ,
        },
        // section 2
        {
          origin: 'CTS',
          destination: 'HKG',
          departureTime: moment.tz("2024-01-01 21:00", "UTC").tz("Asia/Shanghai").toDate(),
          flightTime: 450,
          plane: 'PlaneB' ,
        },
        {
          origin: 'HKG',
          destination: 'NGO',
          departureTime: moment.tz("2024-01-02 09:11", "UTC").tz("Asia/Shanghai").toDate(),
          flightTime: 240,
          plane: 'PlaneB' ,
        },
        {
          origin: 'NGO',
          destination: 'HKG',
          departureTime: moment.tz("2024-01-02 17:34", "UTC").tz("Asia/Shanghai").toDate(),
          flightTime: 240,
          plane: 'PlaneB' ,
        },
        // section 3
        {
          origin: 'YVR',
          destination: 'HKG',
          departureTime: moment.tz("2024-01-02 02:00", "UTC").tz("Asia/Shanghai").toDate(),
          flightTime: 750,
          plane: 'PlaneC' ,
        },
        {
          origin: 'HKG',
          destination: 'NRT',
          departureTime: moment.tz("2024-01-02 19:00", "UTC").tz("Asia/Shanghai").toDate(),
          flightTime: 240,
          plane: 'PlaneC' ,
        },
      ],
    });
    console.log('Flight data created.');
  } catch (error) {
    console.error('Error creating flight data:', error);
  }

  // eslint-disable-next-line no-console
  console.log('Seeding Completed');
  await prisma.$disconnect(); // 关闭数据库连接
};

main().catch(error => {
  // eslint-disable-next-line no-console
  console.warn('Error While generating Seed: \n', error);
  prisma.$disconnect(); // 确保在发生错误时也关闭数据库连接
});