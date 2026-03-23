import { Column } from 'typeorm/decorator/columns/Column.js';
import { PrimaryColumn } from 'typeorm/decorator/columns/PrimaryColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';

@Entity('jwks')
export class Jwks {
    @PrimaryColumn('text')
    id!: string;

    @Column('text', { name: 'publicKey' })
    publicKey!: string;

    @Column('text', { name: 'privateKey' })
    privateKey!: string;

    @Column('date', { name: 'createdAt' })
    createdAt!: Date;

    @Column('date', { name: 'expiresAt', nullable: true })
    expiresAt?: Date | null;
}
