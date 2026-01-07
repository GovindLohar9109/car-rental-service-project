import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CarStatus } from '../enums/car-status.enum';
@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', nullable: false, enum: CarStatus })
  status: CarStatus;

  @Column({ type: 'float', nullable: false })
  price: number;

  @Column({ length: 20, nullable: false })
  type: string;

  @Column({ length: 50, nullable: false })
  model: string;

  @Column({ length: 25, nullable: false })
  color: string;

  @Column({ name: 'total_seat', nullable: false })
  totalSeat: number;

  @Column({
    name: 'insurance_expiration_date',
    nullable: false,
    type: 'timestamptz',
  })
  insuranceExpirationDate: Date;

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
