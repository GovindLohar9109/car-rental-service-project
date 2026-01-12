import { DataSource } from 'typeorm';
import { Role } from '../roles/entities/role.entity';

export default async function roleSeeder(dataSource: DataSource) {
  const roleRepo = dataSource.getRepository(Role);

  const roleData: Partial<Role>[] = [
    { name: 'Admin' },
    { name: 'Car Owner' },
    { name: 'User' },
  ];

  await roleRepo.save(roleData);
}
