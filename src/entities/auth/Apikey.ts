import { Column } from 'typeorm/decorator/columns/Column.js';
import { PrimaryColumn } from 'typeorm/decorator/columns/PrimaryColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';

@Entity('apikey')
export class Apikey {
    @PrimaryColumn('text')
    id!: string;

    @Column('text', { name: 'configId' })
    configId!: string;

    @Column('text', { name: 'name', nullable: true })
    name?: string | null;

    @Column('text', { name: 'start', nullable: true })
    start?: string | null;

    @Column('text', { name: 'referenceId' })
    referenceId!: string;

    @Column('text', { name: 'prefix', nullable: true })
    prefix?: string | null;

    @Column('text', { name: 'key' })
    key!: string;

    @Column('integer', { name: 'refillInterval', nullable: true })
    refillInterval?: string | null;

    @Column('integer', { name: 'refillAmount', nullable: true })
    refillAmount?: string | null;

    @Column('date', { name: 'lastRefillAt', nullable: true })
    lastRefillAt?: Date | null;

    @Column('boolean', { name: 'enabled', nullable: true })
    enabled?: boolean | null;

    @Column('boolean', { name: 'rateLimitEnabled', nullable: true })
    rateLimitEnabled?: boolean | null;

    @Column('integer', { name: 'rateLimitTimeWindow', nullable: true })
    rateLimitTimeWindow?: string | null;

    @Column('integer', { name: 'rateLimitMax', nullable: true })
    rateLimitMax?: string | null;

    @Column('integer', { name: 'requestCount', nullable: true })
    requestCount?: string | null;

    @Column('integer', { name: 'remaining', nullable: true })
    remaining?: string | null;

    @Column('date', { name: 'lastRequest', nullable: true })
    lastRequest?: Date | null;

    @Column('date', { name: 'expiresAt', nullable: true })
    expiresAt?: Date | null;

    @Column('date', { name: 'createdAt' })
    createdAt!: Date;

    @Column('date', { name: 'updatedAt' })
    updatedAt!: Date;

    @Column('text', { name: 'permissions', nullable: true })
    permissions?: string | null;

    @Column('text', { name: 'metadata', nullable: true })
    metadata?: string | null;
}
