import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { UserRole } from './user-role.entity';
import { UserAddress } from './user-address.entity';
import { Exclude, Expose } from 'class-transformer';
@Expose()
@Entity('users')
@Index('users_email_deleted_at_cuidx', ['email', 'deletedAt'], { unique: true })
@Index(['name', 'deletedAt'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 30, type: 'varchar' })
  name: string;

  @Column({ unique: true, nullable: false, length: 254, type: 'varchar' })
  email: string;

  @Column({ nullable: false, type: 'varchar', length: 20 })
  phone: string;

  @Exclude()
  @Column({ nullable: false, type: 'varchar', length: 255 })
  password: string;

  @Exclude()
  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMPZ',
  })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'updated_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMPZ',
  })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({
    type: 'timestamptz',
    name: 'deleted_at',
    nullable: true,
    default: null,
  })
  deletedAt: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @OneToMany(() => UserAddress, (userAddress) => userAddress.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  userAddresses: UserAddress[];
}
