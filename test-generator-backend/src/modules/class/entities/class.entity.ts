import { Chapter } from 'src/modules/chapter/entities/chapter.entity';
import { Book } from 'src/modules/book/entities/book.entity';
import { Question } from 'src/modules/questions/entities/question.longQuestion';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('classes')
export class schoolClass {
    @PrimaryGeneratedColumn('uuid')
    id: string; // uuid

    @Column({ type: 'varchar', length: 255, unique: true })
    name: string;

    @Column({ type: 'int' })
    sortOrder: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    // @UpdateDateColumn({ type: 'timestamptz' }) 
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => Chapter, (chapter) => chapter.class)
    chapters: Chapter[];

    @OneToMany(() => Book, (book) => book.class)
    books: Book[];

    @OneToMany(() => Question, (question) => question.class)
    questions: Question[];
}