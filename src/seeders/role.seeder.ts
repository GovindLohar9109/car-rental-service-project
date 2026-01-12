import { DataSource } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { UserRoleEnum } from '../common/enums/role.enum';

export default async function roleSeeder(dataSource: DataSource) {
  const roleRepo = dataSource.getRepository(Role);

  const roleData = [
    { name: UserRoleEnum.ADMIN },
    { name: UserRoleEnum.CAR_OWNER },
    { name: UserRoleEnum.USER },
  ];

  await roleRepo.upsert(roleRepo.create(roleData), ['name']);
  // upsert -> if row present update otherwise create new row
}
