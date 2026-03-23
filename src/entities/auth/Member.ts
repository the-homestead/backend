import { Column } from 'typeorm/decorator/columns/Column.js';
import { PrimaryColumn } from 'typeorm/decorator/columns/PrimaryColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';

@Entity('member')
export class Member {
    @PrimaryColumn('text')
    id!: string;

    @Column('text', { name: 'organizationId' })
    organizationId!: string;

    @Column('text', { name: 'userId' })
    userId!: string;

    @Column('text', { name: 'role' })
    role!: string;

    @Column('date', { name: 'createdAt' })
    createdAt!: Date;
}
