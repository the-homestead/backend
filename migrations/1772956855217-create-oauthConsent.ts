import { type MigrationInterface, type QueryRunner, Table, TableIndex, TableColumn } from 'typeorm';

export class CreateOauthConsent1772956855217 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'oauthConsent',
        columns: [
          {
            name: 'id',
            type: 'text',
            isPrimary: true,
          },
          {
            name: 'clientId',
            type: 'text',
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
            name: 'scopes',
            type: 'text',
          },
          {
            name: 'createdAt',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'updatedAt',
            type: 'date',
            isNullable: true,
          }
        ],
      }),
    );

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('oauthConsent');
  }
}