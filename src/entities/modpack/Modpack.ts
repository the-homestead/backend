import { Column } from 'typeorm/decorator/columns/Column.js';
import { CreateDateColumn } from 'typeorm/decorator/columns/CreateDateColumn.js';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn.js';
import { UpdateDateColumn } from 'typeorm/decorator/columns/UpdateDateColumn.js';
import { VersionColumn } from 'typeorm/decorator/columns/VersionColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne.js';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany.js';
import Game from '../game/Game';
import { ModpackItem } from './ModpackItem';

@Entity()
export class Modpack {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    slug: string;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @ManyToOne(() => Game)
    game: Game;

    // Better Auth ownership
    @Column()
    ownerId: string;

    @Column()
    ownerType: 'user' | 'organization' | 'team';

    @OneToMany(() => ModpackItem, (i) => i.modpack)
    items: ModpackItem[];

    @VersionColumn()
    internalVersion: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
