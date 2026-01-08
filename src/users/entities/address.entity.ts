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
import { Country } from '../../countries/entities/country.entity';
import { State } from '../../states/entities/state.entity';
import { City } from '../../cities/entities/city.entity';
@Entity('addresses')
@Index(['country', 'state', 'city', 'deletedAt'])
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, name: 'address_line', length: 100 })
  addressLine: string;

  @ManyToOne(() => Country, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => State, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'state_id' })
  state: State;

  @ManyToOne(() => City, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @Column({ length: 15, name: 'zip' })
  zip: string;

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
