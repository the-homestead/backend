import { Column } from 'typeorm/decorator/columns/Column.js';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne.js';
import Game from './Game';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Game)
    game: Game;

    @Column()
    name: string; // "Weapons", "UI", "Quests"

    @Column({ nullable: true })
    slug?: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ default: 0 })
    displayOrder: number; // Display order in ui/api response

    @ManyToOne(() => Category, { nullable: true })
    parent?: Category; // Sub categories Weapons -> Swords, Bows
}
