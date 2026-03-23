import { Column } from 'typeorm/decorator/columns/Column.js';
import { PrimaryColumn } from 'typeorm/decorator/columns/PrimaryColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';

@Entity('oauthRefreshToken')
export class OauthRefreshToken {
    @PrimaryColumn('text')
    id!: string;

    @Column('text', { name: 'token', unique: true })
    token!: string;

    @Column('text', { name: 'clientId' })
    clientId!: string;

    @Column('text', { name: 'sessionId', nullable: true })
    sessionId?: string | null;

    @Column('text', { name: 'userId' })
    userId!: string;

    @Column('text', { name: 'referenceId', nullable: true })
    referenceId?: string | null;

    @Column('date', { name: 'expiresAt', nullable: true })
    expiresAt?: Date | null;

    @Column('date', { name: 'createdAt', nullable: true })
    createdAt?: Date | null;

    @Column('date', { name: 'revoked', nullable: true })
    revoked?: Date | null;

    @Column('date', { name: 'authTime', nullable: true })
    authTime?: Date | null;

    @Column('text', { name: 'scopes' })
    scopes!: string;
}
