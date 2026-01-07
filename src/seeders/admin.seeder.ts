import { generateHashPassword } from '../helpers/hashing.helper';
import { User } from '../users/entities/user.entity';
import { DataSource } from 'typeorm';

export default async function adminSeeder(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const hashPassword = generateHashPassword('ramlal123');
  const adminData = {
    name: 'Ramlal Kumar',
    email: 'ramlal@gmail.com',
    phone: '+91 8585858585',
    password: hashPassword,
  };
  const data: Partial<User>[] = [adminData];

  await userRepo.save(data);
}
