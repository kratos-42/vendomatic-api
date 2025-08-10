import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUser1736268149676 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        columns: [
          {
            default: 'now()',
            name: 'created_at',
            type: 'timestamp with time zone',
          },
          {
            default: 'uuid_generate_v4()',
            isPrimary: true,
            name: 'id',
            type: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'roles',
            type: 'varchar',
          },
          {
            default: 'now()',
            name: 'updated_at',
            type: 'timestamp with time zone',
          },
        ],
        name: 'user',
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.dropTable('user');
  }
}
