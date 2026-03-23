import { Column } from 'typeorm/decorator/columns/Column.js';
import { CreateDateColumn } from 'typeorm/decorator/columns/CreateDateColumn.js';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne.js';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany.js';
import Project from './Project';
import ProjectFile from './ProjectFile';

@Entity()
export default class ProjectRelease {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Project, (p) => p.releases)
    project: Project;

    @Column()
    versionName: string;

    @Column('text')
    changelog: string;

    @Column({ nullable: true })
    gameVersion?: string;

    @Column({ nullable: true })
    modLoader?: string;

    @Column({ default: false })
    isLatest: boolean;

    @Column({ default: false })
    isHidden: boolean;

    @OneToMany(() => ProjectFile, (f) => f.release)
    files: ProjectFile[];

    @CreateDateColumn()
    publishedAt: Date;
}
