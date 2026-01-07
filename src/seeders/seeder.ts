import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { dataSource } from '../db/data-source';
import roleSeeder from './role.seeder';
import adminSeeder from './admin.seeder';

async function runSeeder() {
  try {
    await dataSource.initialize();
    const app = await NestFactory.create(AppModule);
    await roleSeeder(dataSource);
    await adminSeeder(dataSource);
    await app.close();
  } catch (error) {
    console.error('failed to seed data', error);
  }
}

runSeeder();
