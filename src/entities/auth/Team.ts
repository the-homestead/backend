import { Column } from 'typeorm/decorator/columns/Column.js';
import { PrimaryColumn } from 'typeorm/decorator/columns/PrimaryColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';

@Entity('team')
export class Team {
    @PrimaryColumn('text')
    id!: string;

    @Column('text', { name: 'name' })
    name!: string;

    @Column('text', { name: 'organizationId' })
    organizationId!: string;

    @Column('date', { name: 'createdAt' })
    createdAt!: Date;

    @Column('date', { name: 'updatedAt', nullable: true })
    updatedAt?: Date | null;
}
