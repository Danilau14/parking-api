import { DataSource } from 'typeorm';
import { hash } from 'bcryptjs';
import { User, UserRole } from '../users/entities/user.entity';
import { ParkingLot } from '../parking-lots/entities/parking-lot.entity';
import { ParkingHistory } from '../parking-history/entities/parking-history.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'admin',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'parking-api',
  entities: [User, ParkingLot, ParkingHistory, Vehicle],
  synchronize: false,
});

async function seedDatabase() {
  await dataSource.initialize();
  console.log('Connected to database...');

  const userRepository = dataSource.getRepository(User);
  const adminPassword = await hash('admin', 10);
  const admin = userRepository.create({
    email: 'admin@mail.com',
    password: adminPassword,
    role: UserRole.ADMIN,
  });

  await userRepository.save(admin);
  console.log('User Added successfully!');

  await dataSource.destroy();
  console.log('User Admin created!');
}

seedDatabase().catch((err) => {
  console.error('Error in the seed', err);
  process.exit(1);
});
