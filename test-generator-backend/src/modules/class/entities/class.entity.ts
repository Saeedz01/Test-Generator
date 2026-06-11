import { Chapter } from 'src/modules/chapter/entities/chapter.entity';
import { Book } from 'src/modules/book/entities/book.entity';
import { LongQuestion } from 'src/modules/questions/entities/question.longQuestion';
import { ShortQuestion } from 'src/modules/questions/entities/question.shortQuestion';
import { McqQuestion } from 'src/modules/questions/entities/question.mcqs';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('classes')
export class schoolClass {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    name: string;

    @Column({ type: 'int' })
    sortOrder: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => Book, (book) => book.class)
    books: Book[];

    @OneToMany(() => Chapter, (chapter) => chapter.class)
    chapters: Chapter[];

    @OneToMany(() => LongQuestion, (question) => question.class)
    questions: LongQuestion[];

    @OneToMany(() => ShortQuestion, (question) => question.class)
    shortQuestions: ShortQuestion[];

    @OneToMany(() => McqQuestion, (question) => question.class)
    mcqQuestions: McqQuestion[];
}
