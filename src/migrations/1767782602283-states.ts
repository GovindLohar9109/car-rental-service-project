import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class State1767782602283 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'states',
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
            name: 'name',
            type: 'varchar(40)',
            isNullable: false,
          },
          {
            name: 'country_id',
            type: 'int',
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            isNullable: false,
          },
          {
            type: 'timestamptz',
            name: 'updated_at',
            isNullable: false,
          },
          {
            type: 'timestamptz',
            name: 'deleted_at',
            isNullable: true,
            default: null,
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'states',
      new TableForeignKey({
        columnNames: ['country_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'countries',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('states');
  }
}
