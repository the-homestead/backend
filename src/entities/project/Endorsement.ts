import { Column } from 'typeorm/decorator/columns/Column.js';
import { CreateDateColumn } from 'typeorm/decorator/columns/CreateDateColumn.js';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne.js';
import { Unique } from 'typeorm/decorator/Unique.js';

import Project from './Project';

@Entity()
@Unique(['userId', 'project'])
export class Endorsement {
    @PrimaryGeneratedColumn()
    id: number;

    // from better-auth
    @Column()
    userId: string;

    @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    project: Project;

    @CreateDateColumn()
    createdAt: Date;
}
