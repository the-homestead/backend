import { Column } from 'typeorm/decorator/columns/Column.js';
import { PrimaryColumn } from 'typeorm/decorator/columns/PrimaryColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';

@Entity('twoFactor')
export class TwoFactor {
    @PrimaryColumn('text')
    id!: string;

    @Column('text', { name: 'secret' })
    secret!: string;

    @Column('text', { name: 'backupCodes' })
    backupCodes!: string;

    @Column('text', { name: 'userId' })
    userId!: string;
}
