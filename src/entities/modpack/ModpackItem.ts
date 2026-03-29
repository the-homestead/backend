import { Column } from 'typeorm/decorator/columns/Column.js';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne.js';

import ProjectRelease from '../project/ProjectRelease';
import { Modpack } from './Modpack';

@Entity()
export class ModpackItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Modpack, (m) => m.items)
    modpack: Modpack;

    @ManyToOne(() => ProjectRelease)
    release: ProjectRelease;

    @Column({ default: true })
    enabled: boolean;

    @Column({ nullable: true })
    loadOrder?: number;

    @Column({ nullable: true })
    customNotes?: string;
}
