import { Column } from 'typeorm/decorator/columns/Column.js';
import { PrimaryColumn } from 'typeorm/decorator/columns/PrimaryColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';

@Entity('subscription')
export class Subscription {
    @PrimaryColumn('text')
    id!: string;

    @Column('text', { name: 'plan' })
    plan!: string;

    @Column('text', { name: 'referenceId' })
    referenceId!: string;

    @Column('text', { name: 'stripeCustomerId', nullable: true })
    stripeCustomerId?: string | null;

    @Column('text', { name: 'stripeSubscriptionId', nullable: true })
    stripeSubscriptionId?: string | null;

    @Column('text', { name: 'status', nullable: true })
    status?: string | null;

    @Column('date', { name: 'periodStart', nullable: true })
    periodStart?: Date | null;

    @Column('date', { name: 'periodEnd', nullable: true })
    periodEnd?: Date | null;

    @Column('date', { name: 'trialStart', nullable: true })
    trialStart?: Date | null;

    @Column('date', { name: 'trialEnd', nullable: true })
    trialEnd?: Date | null;

    @Column('boolean', { name: 'cancelAtPeriodEnd', nullable: true })
    cancelAtPeriodEnd?: boolean | null;

    @Column('date', { name: 'cancelAt', nullable: true })
    cancelAt?: Date | null;

    @Column('date', { name: 'canceledAt', nullable: true })
    canceledAt?: Date | null;

    @Column('date', { name: 'endedAt', nullable: true })
    endedAt?: Date | null;

    @Column('integer', { name: 'seats', nullable: true })
    seats?: string | null;

    @Column('text', { name: 'billingInterval', nullable: true })
    billingInterval?: string | null;

    @Column('text', { name: 'stripeScheduleId', nullable: true })
    stripeScheduleId?: string | null;
}
