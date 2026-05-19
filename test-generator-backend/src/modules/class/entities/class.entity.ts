import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity('classes')
export class schoolClass {
    @PrimaryGeneratedColumn('uuid')
    id:string; // uuid

    @Column({type: 'varchar', length: 255, unique: true})
    name:string;

    @Column({type: 'int', length: 255})
    sortOrder:number;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt:Date;

    // @UpdateDateColumn({ type: 'timestamptz' }) 
    @UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updatedAt:Date;
}