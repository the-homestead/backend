import { Column } from 'typeorm/decorator/columns/Column.js';
import { PrimaryColumn } from 'typeorm/decorator/columns/PrimaryColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';

@Entity('invitation')
export class Invitation {
    @PrimaryColumn('text')
    id!: string;

    @Column('text', { name: 'organizationId' })
    organizationId!: string;

    @Column('text', { name: 'email', unique: true })
    email!: string;

    @Column('text', { name: 'role', nullable: true })
    role?: string | null;

    @Column('text', { name: 'teamId', nullable: true })
    teamId?: string | null;

    @Column('text', { name: 'status' })
    status!: string;

    @Column('date', { name: 'expiresAt' })
    expiresAt!: Date;

    @Column('date', { name: 'createdAt' })
    createdAt!: Date;

    @Column('text', { name: 'inviterId' })
    inviterId!: string;
}
