import { type MigrationInterface, type QueryRunner, Table, TableIndex, TableColumn } from 'typeorm';

export class CreateApikey1772956855217 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'apikey',
        columns: [
          {
            name: 'id',
            type: 'text',
            isPrimary: true,
          },
          {
            name: 'configId',
            type: 'text',
          },
          {
            name: 'name',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'start',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'referenceId',
            type: 'text',
          },
          {
            name: 'prefix',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'key',
            type: 'text',
          },
          {
            name: 'refillInterval',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'refillAmount',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'lastRefillAt',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'enabled',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'rateLimitEnabled',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'rateLimitTimeWindow',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'rateLimitMax',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'requestCount',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'remaining',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'lastRequest',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'expiresAt',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'date',
          },
          {
            name: 'updatedAt',
            type: 'date',
          },
          {
            name: 'permissions',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'text',
            isNullable: true,
          }
        ],
      }),
    );

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('apikey');
  }
}