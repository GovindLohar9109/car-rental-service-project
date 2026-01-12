import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class Booking1767800000010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'bookings',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'car_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'total_amount',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enumName: 'booking_status_enum',
            enum: ['CONFIRMED', 'ONGOING', 'COMPLETE', 'EXPIRED'],
            isNullable: false,
          },
          {
            name: 'start_date',
            type: 'timestamptz',
            isNullable: false,
          },
          {
            name: 'end_date',
            type: 'timestamptz',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamptz',
            isNullable: true,
            default: null,
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('bookings', [
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['car_id'],
        referencedTableName: 'cars',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    ]);

    await queryRunner.createIndex(
      'bookings',
      new TableIndex({
        name: 'bookings_user_car_status_cidx',
        columnNames: ['user_id', 'car_id', 'status', 'deleted_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('bookings');
  }
}
