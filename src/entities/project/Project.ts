import { Column } from 'typeorm/decorator/columns/Column.js';
import { CreateDateColumn } from 'typeorm/decorator/columns/CreateDateColumn.js';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn.js';
import { UpdateDateColumn } from 'typeorm/decorator/columns/UpdateDateColumn.js';
import { VersionColumn } from 'typeorm/decorator/columns/VersionColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';
import { JoinTable } from 'typeorm/decorator/relations/JoinTable.js';
import { ManyToMany } from 'typeorm/decorator/relations/ManyToMany.js';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne.js';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany.js';
import Game from '../game/Game';
import ProjectRelease from './ProjectRelease';
import { Category } from '../game/Category';
import Tag from './ProjectTag';
import ProjectComment from './ProjectComment';

/**
 * Project — a mod, addon, or other user-created asset targeting a specific game.
 */
@Entity()
export default class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    slug: string;

    @Column()
    title: string;

    @Column('text')
    shortDescription: string;

    @Column('text')
    description: string;

    @ManyToOne(() => Game)
    game: Game;

    @Column()
    ownerId: string;

    @Column()
    ownerType: 'user' | 'organization' | 'team';

    @Column({ default: 0 })
    endorsementCount: number;

    @OneToMany(() => ProjectRelease, (r) => r.project)
    releases: ProjectRelease[];

    @Column({ default: 0 })
    downloadCount: number;

    @ManyToMany(() => Category)
    @JoinTable()
    categories: Category[];

    @ManyToMany(() => Tag)
    @JoinTable()
    tags?: Tag[];

    @VersionColumn()
    internalVersion: number;

    @OneToMany(() => ProjectComment, (c) => c.project)
    comments?: ProjectComment[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
