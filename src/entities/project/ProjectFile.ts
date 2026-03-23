import { Column } from 'typeorm/decorator/columns/Column.js';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne.js';
import ProjectRelease from './ProjectRelease';

@Entity()
export default class ProjectFile {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ProjectRelease, (r) => r.files)
    release: ProjectRelease;

    @Column()
    fileName: string;

    @Column()
    fileUrl: string;

    @Column()
    fileSize: number;

    @Column({ nullable: true })
    checksum?: string;
}
