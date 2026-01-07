import bcrypt from 'bcrypt';

export function generateHashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function comparePassword(hashPassword: string, password: string) {
  return bcrypt.compare(password, hashPassword);
}
