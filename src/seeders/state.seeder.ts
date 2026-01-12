import { DataSource } from 'typeorm';
import { State } from '../states/entities/state.entity';
import { Country } from 'src/countries/entities/country.entity';

export default async function stateSeeder(dataSource: DataSource) {
  const stateRepo = dataSource.getRepository(State);
  const countryRepo = dataSource.getRepository(Country);

  const countryData = await countryRepo.findOne({
    where: { name: 'India' },
  });
  const stateData = [
    {
      name: 'Madhya Pradesh',
      country: { id: countryData?.id },
    },
    {
      name: 'Rajasthan',
      country: { id: countryData?.id },
    },
  ];
  await countryRepo.save(stateData);
}
