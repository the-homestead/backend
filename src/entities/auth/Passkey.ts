import { Column } from 'typeorm/decorator/columns/Column.js';
import { PrimaryColumn } from 'typeorm/decorator/columns/PrimaryColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';

@Entity('passkey')
export class Passkey {
    @PrimaryColumn('text')
    id!: string;

    @Column('text', { name: 'name', nullable: true })
    name?: string | null;

    @Column('text', { name: 'publicKey' })
    publicKey!: string;

    @Column('text', { name: 'userId' })
    userId!: string;

    @Column('text', { name: 'credentialID' })
    credentialID!: string;

    @Column('integer', { name: 'counter' })
    counter!: string;

    @Column('text', { name: 'deviceType' })
    deviceType!: string;

    @Column('boolean', { name: 'backedUp' })
    backedUp!: boolean;

    @Column('text', { name: 'transports', nullable: true })
    transports?: string | null;

    @Column('date', { name: 'createdAt', nullable: true })
    createdAt?: Date | null;

    @Column('text', { name: 'aaguid', nullable: true })
    aaguid?: string | null;
}
