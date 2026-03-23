import { type MigrationInterface, type QueryRunner, Table, TableIndex, TableColumn } from 'typeorm';

export class CreateSubscription1772956855217 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'subscription',
        columns: [
          {
            name: 'id',
            type: 'text',
            isPrimary: true,
          },
          {
            name: 'plan',
            type: 'text',
          },
          {
            name: 'referenceId',
            type: 'text',
          },
          {
            name: 'stripeCustomerId',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'stripeSubscriptionId',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'periodStart',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'periodEnd',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'trialStart',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'trialEnd',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'cancelAtPeriodEnd',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'cancelAt',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'canceledAt',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'endedAt',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'seats',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'billingInterval',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'stripeScheduleId',
            type: 'text',
            isNullable: true,
          }
        ],
      }),
    );

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('subscription');
  }
}