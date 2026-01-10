import { DataSource } from 'typeorm';
import { State } from '../states/entities/state.entity';
import { City } from '../cities/entities/city.entity';
import { locations } from './locations.data';

export default async function citySeeder(dataSource: DataSource) {
  const cityRepo = dataSource.getRepository(City);
  const stateRepo = dataSource.getRepository(State);

  const statesData = await stateRepo.find();
  const stateMap = new Map(statesData.map((state) => [state.name, state.id]));

  const cityData = locations.flatMap((location) => {
    return location.states.flatMap((state) => {
      return state.cities.map((cityName) => {
        return {
          name: cityName,
          state: { id: stateMap.get(state.name) },
        };
      });
    });
  });
  await cityRepo.upsert(cityRepo.create(cityData), ['name', 'state']);
}
