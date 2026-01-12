import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class Addresse1767800000007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'addresses',
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
            name: 'address_line',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'country_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'state_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'city_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'zip',
            type: 'varchar',
            length: '15',
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

    await queryRunner.createForeignKeys('addresses', [
      new TableForeignKey({
        columnNames: ['country_id'],
        referencedTableName: 'countries',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['state_id'],
        referencedTableName: 'states',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['city_id'],
        referencedTableName: 'cities',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    ]);

    await queryRunner.createIndex(
      'addresses',
      new TableIndex({
        name: 'addresses_location_cidx',
        columnNames: ['country_id', 'state_id', 'city_id', 'deleted_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('addresses');
  }
}
