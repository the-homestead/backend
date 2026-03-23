import { Column } from 'typeorm/decorator/columns/Column.js';
import { PrimaryColumn } from 'typeorm/decorator/columns/PrimaryColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';

@Entity('oauthConsent')
export class OauthConsent {
    @PrimaryColumn('text')
    id!: string;

    @Column('text', { name: 'clientId' })
    clientId!: string;

    @Column('text', { name: 'userId', nullable: true })
    userId?: string | null;

    @Column('text', { name: 'referenceId', nullable: true })
    referenceId?: string | null;

    @Column('text', { name: 'scopes' })
    scopes!: string;

    @Column('date', { name: 'createdAt', nullable: true })
    createdAt?: Date | null;

    @Column('date', { name: 'updatedAt', nullable: true })
    updatedAt?: Date | null;
}
