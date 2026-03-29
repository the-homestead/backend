import { Column } from 'typeorm/decorator/columns/Column.js';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne.js';

import Game from '../game/Game';

/**
 * A Tag is used to better categories projects, its optional, but projects may add as many tags as they would like to help search.
 */
@Entity()
export default class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Game)
    game: Game;

    @Column()
    name: string;

    @Column()
    slug: string;
}
