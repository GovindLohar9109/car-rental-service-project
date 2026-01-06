import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('users')
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

  @Column({ nullable: false, type: 'varchar', length: 255 })
  password: string;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMPZ',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'updated_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMPZ',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamptz',
    name: 'deleted_at',
    nullable: true,
    default: null,
  })
  deletedAt: Date;
}
