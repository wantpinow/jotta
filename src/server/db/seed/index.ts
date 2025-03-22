import { initializePg } from '..';
import { seedUsers } from './users';

export const { conn, db } = initializePg();

export const seed = async () => {
  console.log('Seeding...');
  console.time('DB has been seeded!');

  console.time('Users have been seeded!...');
  await seedUsers(db);
  console.timeEnd('Users have been seeded!...');

  console.timeEnd('DB has been seeded!');
};

try {
  await seed();
  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(1);
}
