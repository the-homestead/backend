import { type MigrationInterface, type QueryRunner, Table, TableIndex, TableColumn } from 'typeorm';

export class CreatePasskey1772956855217 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'passkey',
        columns: [
          {
            name: 'id',
            type: 'text',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'publicKey',
            type: 'text',
          },
          {
            name: 'userId',
            type: 'text',
          },
          {
            name: 'credentialID',
            type: 'text',
          },
          {
            name: 'counter',
            type: 'integer',
          },
          {
            name: 'deviceType',
            type: 'text',
          },
          {
            name: 'backedUp',
            type: 'boolean',
          },
          {
            name: 'transports',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'aaguid',
            type: 'text',
            isNullable: true,
          }
        ],
      }),
    );

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('passkey');
  }
}