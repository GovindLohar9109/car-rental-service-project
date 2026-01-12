import { DataSource } from 'typeorm';
import { Country } from '../countries/entities/country.entity';

export default async function countrySeeder(dataSource: DataSource) {
  const countryRepo = dataSource.getRepository(Country);
  const countryData = { name: 'India' };
  await countryRepo.save(countryData);
}
