import { type MigrationInterface, type QueryRunner, Table, TableIndex, TableColumn } from 'typeorm';

export class CreateInvitation1772956855217 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'invitation',
        columns: [
          {
            name: 'id',
            type: 'text',
            isPrimary: true,
          },
          {
            name: 'organizationId',
            type: 'text',
          },
          {
            name: 'email',
            type: 'text',
          },
          {
            name: 'role',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'teamId',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'text',
          },
          {
            name: 'expiresAt',
            type: 'date',
          },
          {
            name: 'createdAt',
            type: 'date',
          },
          {
            name: 'inviterId',
            type: 'text',
          }
        ],
      }),
    );

    await queryRunner.createIndex(
      'invitation',
      new TableIndex({
        name: 'IDX_invitation_email',
        columnNames: ['email'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('invitation');
  }
}