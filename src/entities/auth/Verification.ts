import { Column } from 'typeorm/decorator/columns/Column.js';
import { PrimaryColumn } from 'typeorm/decorator/columns/PrimaryColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';

@Entity('verification')
export class Verification {
    @PrimaryColumn('text')
    id!: string;

    @Column('text', { name: 'identifier' })
    identifier!: string;

    @Column('text', { name: 'value' })
    value!: string;

    @Column('date', { name: 'expiresAt' })
    expiresAt!: Date;

    @Column('date', { name: 'createdAt' })
    createdAt!: Date;

    @Column('date', { name: 'updatedAt' })
    updatedAt!: Date;
}
