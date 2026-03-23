import { type MigrationInterface, type QueryRunner, Table, TableIndex, TableColumn } from 'typeorm';

export class CreateJwks1772956855217 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'jwks',
        columns: [
          {
            name: 'id',
            type: 'text',
            isPrimary: true,
          },
          {
            name: 'publicKey',
            type: 'text',
          },
          {
            name: 'privateKey',
            type: 'text',
          },
          {
            name: 'createdAt',
            type: 'date',
          },
          {
            name: 'expiresAt',
            type: 'date',
            isNullable: true,
          }
        ],
      }),
    );

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('jwks');
  }
}