import bcrypt from 'bcrypt';

export function generateHashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function comparePassword(
  password: string,
  hashPassword: string,
): boolean {
  return bcrypt.compare(password, hashPassword);
}
