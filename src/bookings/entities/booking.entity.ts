import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Car } from '../../cars/entities/car.entity';
import { BookingStatus } from '../enums/booking.enum';
import { Exclude, Expose } from 'class-transformer';
@Expose()
@Entity('bookings')
@Index(['user', 'car', 'status', 'deletedAt'])
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float', nullable: false, name: 'total_amount' })
  totalAmount: number;

  @Column({ type: 'enum', enum: BookingStatus })
  status: BookingStatus;

  @Column({ name: 'start_date', nullable: false, type: 'timestamptz' })
  startDate: Date;

  @Column({ name: 'end_date', nullable: false, type: 'timestamptz' })
  endDate: Date;

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

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Car, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'car_id' })
  car: Car;
}
