import { DataSource } from 'typeorm';
import { Country } from '../countries/entities/country.entity';
import { locations } from './locations.data';

export default async function countrySeeder(dataSource: DataSource) {
  const countryRepo = dataSource.getRepository(Country);
  const countriesData: object = locations.map((location) => {
    return { name: location.country };
  });
  await countryRepo.save(countryRepo.create(countriesData));
}
