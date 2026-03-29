import { Column } from 'typeorm/decorator/columns/Column.js';
import { CreateDateColumn } from 'typeorm/decorator/columns/CreateDateColumn.js';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne.js';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany.js';

import Project from './Project';
import ProjectFile from './ProjectFile';

export enum ReleaseType {
    Release = 'release',
    Beta = 'beta',
    Alpha = 'alpha',
    Testing = 'testing',
}

@Entity()
export default class ProjectRelease {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Project, (p) => p.releases)
    project: Project;

    @Column()
    versionName: string;

    @Column({ type: 'enum', enum: ReleaseType, enumName: 'release_type' })
    releaseType: ReleaseType;

    @Column('text')
    changelog: string;

    @Column('simple-array', { nullable: true })
    gameVersions?: string[];

    @Column('simple-array', { nullable: true })
    modLoaders?: string[];

    @Column({ default: false })
    isHidden: boolean;

    @OneToMany(() => ProjectFile, (f) => f.release)
    files: ProjectFile[];

    @CreateDateColumn()
    publishedAt: Date;
}
