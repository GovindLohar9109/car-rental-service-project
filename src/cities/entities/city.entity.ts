import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { State } from '../../states/entities/state.entity';
import { Expose } from 'class-transformer';
@Expose()
@Entity('cities')
@Index(['state', 'name', 'deletedAt'])
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40, nullable: false })
  name: string;
  @ManyToOne(() => State, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'state_id' })
  state: State;

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
