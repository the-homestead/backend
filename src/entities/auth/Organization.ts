import { Column } from 'typeorm/decorator/columns/Column.js';
import { PrimaryColumn } from 'typeorm/decorator/columns/PrimaryColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';

@Entity('organization')
export class Organization {
    @PrimaryColumn('text')
    id!: string;

    @Column('text', { name: 'name' })
    name!: string;

    @Column('text', { name: 'slug', unique: true })
    slug!: string;

    @Column('text', { name: 'logo', nullable: true })
    logo?: string | null;

    @Column('date', { name: 'createdAt' })
    createdAt!: Date;

    @Column('text', { name: 'metadata', nullable: true })
    metadata?: string | null;
}
