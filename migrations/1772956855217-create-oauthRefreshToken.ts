import { type MigrationInterface, type QueryRunner, Table, TableIndex, TableColumn } from 'typeorm';

export class CreateOauthRefreshToken1772956855217 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'oauthRefreshToken',
        columns: [
          {
            name: 'id',
            type: 'text',
            isPrimary: true,
          },
          {
            name: 'token',
            type: 'text',
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
          },
          {
            name: 'referenceId',
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
            name: 'revoked',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'authTime',
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

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('oauthRefreshToken');
  }
}