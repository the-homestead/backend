import { Column } from 'typeorm/decorator/columns/Column.js';
import { CreateDateColumn } from 'typeorm/decorator/columns/CreateDateColumn.js';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';

/**
 * Game — a supported game that mods/projects can target.
 *
 * Array columns (developers, publishers, genres, platforms, knownPaths) use
 * TypeORM's 'simple-array' storage, which serialises as a comma-separated
 * string in a single TEXT column. If you need per-element querying later,
 * switch to 'simple-array' → jsonb.
 *
 * The erroneous self-referential @ManyToOne(() => Game) relation has been
 * removed — a Game doesn't belong to another Game.
 */
@Entity()
export default class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    slug: string; // "skyrim", "elden-ring"

    @Column()
    name: string;

    @Column({ nullable: true })
    coverImageUrl: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    releaseDate: Date;

    @Column({ type: 'simple-array', nullable: true })
    developers: string[];

    @Column({ type: 'simple-array', nullable: true })
    publishers: string[];

    @Column({ type: 'simple-array', nullable: true })
    genres: string[];

    @Column({ type: 'simple-array', nullable: true })
    platforms: string[];

    @Column({ type: 'simple-array', nullable: true })
    knownPaths: string[];

    @Column({ nullable: true })
    executableName: string;

    @Column('jsonb', { nullable: true })
    metadata: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;
}
