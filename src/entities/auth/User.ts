import { Column } from 'typeorm/decorator/columns/Column.js';
import { PrimaryColumn } from 'typeorm/decorator/columns/PrimaryColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';

@Entity('user')
export class User {
    @PrimaryColumn('text')
    id!: string;

    @Column('text', { name: 'name' })
    name!: string;

    @Column('text', { name: 'email', unique: true })
    email!: string;

    @Column('boolean', { name: 'emailVerified' })
    emailVerified!: boolean;

    @Column('text', { name: 'image', nullable: true })
    image?: string | null;

    @Column('date', { name: 'createdAt' })
    createdAt!: Date;

    @Column('date', { name: 'updatedAt' })
    updatedAt!: Date;

    @Column('boolean', { name: 'twoFactorEnabled', nullable: true })
    twoFactorEnabled?: boolean | null;

    @Column('text', { name: 'username', nullable: true, unique: true })
    username?: string | null;

    @Column('text', { name: 'displayUsername', nullable: true })
    displayUsername?: string | null;

    @Column('text', { name: 'role', nullable: true })
    role?: string | null;

    @Column('boolean', { name: 'banned', nullable: true })
    banned?: boolean | null;

    @Column('text', { name: 'banReason', nullable: true })
    banReason?: string | null;

    @Column('date', { name: 'banExpires', nullable: true })
    banExpires?: Date | null;

    @Column('text', { name: 'stripeCustomerId', nullable: true })
    stripeCustomerId?: string | null;

    @Column('integer', { name: 'age', nullable: true })
    age?: number | null;

    @Column('boolean', { name: 'agePublic', nullable: true })
    agePublic?: boolean | null;

    @Column('text', { name: 'firstName', nullable: true })
    firstName?: string | null;

    @Column('boolean', { name: 'firstNamePublic', nullable: true })
    firstNamePublic?: boolean | null;

    @Column('text', { name: 'lastName', nullable: true })
    lastName?: string | null;

    @Column('boolean', { name: 'lastNamePublic', nullable: true })
    lastNamePublic?: boolean | null;

    @Column('text', { name: 'bio', nullable: true })
    bio?: string | null;
}
