import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { schoolClass } from '../../class/entities/class.entity';
import { Book } from '../../book/entities/book.entity';
import { Chapter } from '../../chapter/entities/chapter.entity';

@Entity('mcq_questions')
export class McqQuestion {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255 })
    question_text!: string;

    @Column({ type: 'json' })
    options!: string[];

    @ManyToOne(() => schoolClass, (cls) => cls.mcqQuestions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'classId' })
    class!: schoolClass;

    @ManyToOne(() => Book, (book) => book.mcqQuestions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'bookId' })
    book!: Book;

    @ManyToOne(() => Chapter, (chapter) => chapter.mcqQuestions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'chapterId' })
    chapter!: Chapter;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}
