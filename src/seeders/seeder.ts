import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { dataSource } from '../db/data-source';
import roleSeeder from './role.seeder';
import adminSeeder from './admin.seeder';
import countrySeeder from './country.seeder';
import stateSeeder from './state.seeder';
import citySeeder from './city.seeder';

async function runSeeder() {
  try {
    await dataSource.initialize();
    const app = await NestFactory.create(AppModule);
    await roleSeeder(dataSource);
    await adminSeeder(dataSource);
    await countrySeeder(dataSource);
    await stateSeeder(dataSource);
    await citySeeder(dataSource);
    await app.close();
  } catch (error) {}
}

runSeeder();
