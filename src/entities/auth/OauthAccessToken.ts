import { Column } from 'typeorm/decorator/columns/Column.js';
import { PrimaryColumn } from 'typeorm/decorator/columns/PrimaryColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';

@Entity('oauthAccessToken')
export class OauthAccessToken {
    @PrimaryColumn('text')
    id!: string;

    @Column('text', { name: 'token', nullable: true, unique: true })
    token?: string | null;

    @Column('text', { name: 'clientId' })
    clientId!: string;

    @Column('text', { name: 'sessionId', nullable: true })
    sessionId?: string | null;

    @Column('text', { name: 'userId', nullable: true })
    userId?: string | null;

    @Column('text', { name: 'referenceId', nullable: true })
    referenceId?: string | null;

    @Column('text', { name: 'refreshId', nullable: true })
    refreshId?: string | null;

    @Column('date', { name: 'expiresAt', nullable: true })
    expiresAt?: Date | null;

    @Column('date', { name: 'createdAt', nullable: true })
    createdAt?: Date | null;

    @Column('text', { name: 'scopes' })
    scopes!: string;
}
