import { Column } from 'typeorm/decorator/columns/Column.js';
import { PrimaryColumn } from 'typeorm/decorator/columns/PrimaryColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';

@Entity('teamMember')
export class TeamMember {
    @PrimaryColumn('text')
    id!: string;

    @Column('text', { name: 'teamId' })
    teamId!: string;

    @Column('text', { name: 'userId' })
    userId!: string;

    @Column('date', { name: 'createdAt', nullable: true })
    createdAt?: Date | null;
}
