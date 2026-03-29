import { Column } from 'typeorm/decorator/columns/Column.js';
import { CreateDateColumn } from 'typeorm/decorator/columns/CreateDateColumn.js';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne.js';

import ProjectRelease from './ProjectRelease';

export enum FileType {
    PRIMARY = 'primary',
    SOURCE = 'source',
    ADDON = 'addon',
    RESOURCEPACK = 'resource_pack',
    DATAPACK = 'data_pack',
    MEDIA = 'media',
    DOCUMENTATION = 'docs',
}

export enum ScanStatus {
    PENDING = 'pending',
    CLEAN = 'clean',
    FLAGGED = 'flagged',
    FAILED = 'failed',
}

@Entity()
export default class ProjectFile {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ProjectRelease, (r) => r.files)
    release: ProjectRelease;

    @Column()
    fileName: string; // name of file

    @Column()
    fileUrl: string; // url of uploaded file

    @Column({ unique: true })
    storageKey: string; // what is the name the file is stored under?

    @Column({ type: 'bigint' })
    fileSize: number; // how big is this file?

    @Column({ type: 'enum', enum: FileType, enumName: 'file_type' })
    fileType: FileType; // what kind of file is this?

    @Column({ default: false })
    isPrimary: boolean; // Is primary displayed in files tab

    @Column({ nullable: true })
    mimeType: string; // File MIME type

    @Column({ type: 'enum', enum: ScanStatus, enumName: 'scan_status' })
    scanStatus: ScanStatus; // What Dat Scan Doin?

    @Column({ nullable: true })
    scanAt: Date; // Did it scan yet?

    @Column({ type: 'bigint', default: 0 })
    downloadCount: number; // Can i install more download speed?

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    MD5: string; // MD5 File Checksum

    @Column()
    SHA1: string; // SHA1 File Checksum

    @Column()
    SHA256: string; // SHA256 File Checksum

    @Column()
    SHA512: string; // SHA512 File Checksum
}
