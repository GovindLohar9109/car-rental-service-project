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
<<<<<<< HEAD
import { Country } from '../../countries/entities/country.entity';
=======
import { Country } from '../../countries/entities/country.entities';
>>>>>>> ba79b8aa6593304b54d12dd31e378ae03dc1c476
@Entity('states')
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40, nullable: false })
  name: string;

  @ManyToOne(() => Country, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'country_id' })
  country: Country;

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
