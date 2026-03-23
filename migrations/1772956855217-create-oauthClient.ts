import { type MigrationInterface, type QueryRunner, Table, TableIndex, TableColumn } from 'typeorm';

export class CreateOauthClient1772956855217 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'oauthClient',
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
            name: 'clientSecret',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'disabled',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'skipConsent',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'enableEndSession',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'scopes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'userId',
            type: 'text',
            isNullable: true,
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
          },
          {
            name: 'name',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'uri',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'icon',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'contacts',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'tos',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'policy',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'softwareId',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'softwareVersion',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'softwareStatement',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'redirectUris',
            type: 'text',
          },
          {
            name: 'postLogoutRedirectUris',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'tokenEndpointAuthMethod',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'grantTypes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'responseTypes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'public',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'requirePKCE',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'referenceId',
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

    await queryRunner.createIndex(
      'oauthClient',
      new TableIndex({
        name: 'IDX_oauthClient_clientId',
        columnNames: ['clientId'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('oauthClient');
  }
}