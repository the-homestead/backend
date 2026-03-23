import { Column } from 'typeorm/decorator/columns/Column.js';
import { CreateDateColumn } from 'typeorm/decorator/columns/CreateDateColumn.js';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne.js';
import Project from './Project';
import { VersionColumn } from 'typeorm';

@Entity()
export default class ProjectComment {
    @PrimaryGeneratedColumn()
    id: number;

    // Inverse side of Project.comments (@OneToMany)
    @ManyToOne(() => Project, (p) => p.comments, { onDelete: 'CASCADE' })
    project: Project;

    @Column()
    userId: string;

    @Column('text')
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @VersionColumn()
    internalVersion: number;
}
