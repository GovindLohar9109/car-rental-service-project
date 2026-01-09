import { DataSource } from 'typeorm';
import { State } from '../states/entities/state.entity';
import { Country } from '../countries/entities/country.entity';
import { locations } from './locations.data';

export default async function stateSeeder(dataSource: DataSource) {
  const stateRepo = dataSource.getRepository(State);
  const countryRepo = dataSource.getRepository(Country);

  const countriesData = await countryRepo.find();
  const countryMap = new Map(
    countriesData.map((country) => [country.name, country.id]),
  );
  // map() + flat()=flatMap()
  const statesData = locations.flatMap((location) =>
    location.states.map((state) => ({
      name: state.name,
      country: { id: countryMap.get(location.country) },
    })),
  );
  console.log(statesData);
  await stateRepo.save(statesData);
}
