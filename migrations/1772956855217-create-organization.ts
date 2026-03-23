import { type MigrationInterface, type QueryRunner, Table, TableIndex, TableColumn } from 'typeorm';

export class CreateOrganization1772956855217 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'organization',
        columns: [
          {
            name: 'id',
            type: 'text',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'text',
          },
          {
            name: 'slug',
            type: 'text',
          },
          {
            name: 'logo',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'date',
          },
          {
            name: 'metadata',
            type: 'text',
            isNullable: true,
          }
        ],
      }),
    );

    await queryRunner.createIndex(
      'organization',
      new TableIndex({
        name: 'IDX_organization_slug',
        columnNames: ['slug'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('organization');
  }
}