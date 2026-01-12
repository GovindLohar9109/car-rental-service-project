import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class User1767800000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
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
            type: 'varchar(30)',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar(254)',
            isNullable: false,
          },
          {
            name: 'phone',
            type: 'varchar(20)',
            isNullable: false,
          },

          {
            name: 'password',
            type: 'varchar(255)',
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

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'users_name_cidx',
        columnNames: ['name', 'deleted_at'],
      }),
    );
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'users_email_deleted_at_cuidx',
        columnNames: ['email', 'deleted_at'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
