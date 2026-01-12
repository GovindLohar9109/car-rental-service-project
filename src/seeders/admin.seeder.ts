import { UserRole } from '../users/entities/user-role.entity';
import { generateHashPassword } from '../auth/helpers/hashing.helper';
import { User } from '../users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import dotenv from 'dotenv';
dotenv.config();
export default async function adminSeeder(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const userRoleRepo = dataSource.getRepository(UserRole);
  const roleRepo = dataSource.getRepository(Role);
  const hashPassword = generateHashPassword(process.env.ADMIN_PASSWORD);
  const adminData = {
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    phone: process.env.ADMIN_PHONE,
    password: hashPassword,
  };
  const userData = await userRepo.save(userRepo.create(adminData));
  const roleData = await roleRepo.findOne({
    where: { name: 'Admin' },
    select: { id: true },
  });
  await userRoleRepo.save(
    userRoleRepo.create({
      user: { id: userData.id },
      role: { id: roleData?.id },
    }),
  );
}
