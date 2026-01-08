import { UserRole } from '../users/entities/user-role.entity';
import { generateHashPassword } from '../auth/helpers/hashing.helper';
import { User } from '../users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Role } from '../roles/entities/role.entity';

export default async function adminSeeder(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const userRoleRepo = dataSource.getRepository(UserRole);
  const roleRepo = dataSource.getRepository(Role);
  const hashPassword = generateHashPassword('ramlal123');
  const adminData = {
    name: 'Ramlal Kumar',
    email: 'ramlal@gmail.com',
    phone: '+91 8585858585',
    password: hashPassword,
  };
  const userData = await userRepo.save(adminData);
  const roleData = await roleRepo.findOne({
    where: { name: 'Admin' },
    select: { id: true },
  });
  await userRoleRepo.save({
    user: { id: userData.id },
    role: { id: roleData?.id },
  });
}
