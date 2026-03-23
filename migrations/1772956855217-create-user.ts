import { type MigrationInterface, type QueryRunner, Table, TableIndex, TableColumn } from 'typeorm';

export class CreateUser1772956855217 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
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
            name: 'email',
            type: 'text',
          },
          {
            name: 'emailVerified',
            type: 'boolean',
          },
          {
            name: 'image',
            type: 'text',
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
            name: 'twoFactorEnabled',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'username',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'displayUsername',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'role',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'banned',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'banReason',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'banExpires',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'stripeCustomerId',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'age',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'agePublic',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'firstName',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'firstNamePublic',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'lastName',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'lastNamePublic',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'bio',
            type: 'text',
            isNullable: true,
          }
        ],
      }),
    );

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_user_email',
        columnNames: ['email'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_user_username',
        columnNames: ['username'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}