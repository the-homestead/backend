import { OneToMany, UpdateDateColumn, VersionColumn } from 'typeorm';
import { Column } from 'typeorm/decorator/columns/Column.js';
import { CreateDateColumn } from 'typeorm/decorator/columns/CreateDateColumn.js';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne.js';

import Project from './Project';

@Entity()
export default class ProjectComment {
    @PrimaryGeneratedColumn()
    id: number;

    // Inverse side of Project.comments (@OneToMany)
    @ManyToOne(() => Project, (p) => p.comments, { onDelete: 'CASCADE' })
    project: Project;

    @ManyToOne(() => ProjectComment, { nullable: true, onDelete: 'CASCADE' })
    parent?: ProjectComment;

    @OneToMany(() => ProjectComment, (c) => c.parent)
    replies?: ProjectComment[];

    @Column()
    userId: string;

    @Column('text')
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @VersionColumn()
    internalVersion: number;
}
