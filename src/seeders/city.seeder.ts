import { DataSource } from 'typeorm';
import { State } from '../states/entities/state.entity';
import { City } from 'src/cities/entities/city.entity';

export default async function citySeeder(dataSource: DataSource) {
  const cityRepo = dataSource.getRepository(City);
  const stateRepo = dataSource.getRepository(State);

  const rajasthanState = await stateRepo.findOne({
    where: { name: 'Rajasthan' },
  });
  const madhyaPradeshState = await stateRepo.findOne({
    where: { name: 'Madhya Pradesh' },
  });
  const cityData = [
    {
      name: 'Udaipur',
      state: { id: rajasthanState?.id },
    },
    {
      name: 'Neemuch',
      state: { id: madhyaPradeshState?.id },
    },
  ];
  await cityRepo.save(cityData);
}
