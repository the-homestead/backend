import { CreateDateColumn } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column.js';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne.js';

import Project from './Project';
import ProjectRelease from './ProjectRelease';

export enum ProjectRelationType {
    Dependency = 'dependency',
    Conflict = 'conflict',
    LoadAfter = 'load_after',
    LoadBefore = 'load_before',
}

@Entity()
export default class ProjectRelationship {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Project)
    sourceProject: Project;

    @ManyToOne(() => Project)
    targetProject: Project;

    @ManyToOne(() => ProjectRelease, { nullable: true })
    sourceRelease?: ProjectRelease;

    @ManyToOne(() => ProjectRelease, { nullable: true })
    targetRelease?: ProjectRelease;

    @Column({
        type: 'enum',
        enum: ProjectRelationType,
        enumName: 'project_relationship_type',
    })
    type: ProjectRelationType;

    @Column({ nullable: true })
    minVersion?: string;

    @Column({ nullable: true })
    maxVersion?: string;

    @Column({ default: false })
    optional: boolean;

    @Column('text', { nullable: true })
    notes?: string;

    @Column('jsonb', { nullable: true })
    metadata?: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;
}
