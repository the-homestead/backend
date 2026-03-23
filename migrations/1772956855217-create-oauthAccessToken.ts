import { type MigrationInterface, type QueryRunner, Table, TableIndex, TableColumn } from 'typeorm';

export class CreateOauthAccessToken1772956855217 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'oauthAccessToken',
        columns: [
          {
            name: 'id',
            type: 'text',
            isPrimary: true,
          },
          {
            name: 'token',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'clientId',
            type: 'text',
          },
          {
            name: 'sessionId',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'userId',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'referenceId',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'refreshId',
            type: 'text',
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
            isNullable: true,
          },
          {
            name: 'scopes',
            type: 'text',
          }
        ],
      }),
    );

    await queryRunner.createIndex(
      'oauthAccessToken',
      new TableIndex({
        name: 'IDX_oauthAccessToken_token',
        columnNames: ['token'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('oauthAccessToken');
  }
}