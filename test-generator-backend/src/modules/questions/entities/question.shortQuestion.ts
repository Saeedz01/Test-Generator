import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { schoolClass } from '../../class/entities/class.entity';
import { Book } from '../../book/entities/book.entity';
import { Chapter } from '../../chapter/entities/chapter.entity';

@Entity('short_questions')
export class ShortQuestion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    question_text: string;

    @ManyToOne(() => schoolClass, (cls) => cls.shortQuestions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'classId' })
    class: schoolClass;

    @ManyToOne(() => Book, (book) => book.shortQuestions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'bookId' })
    book: Book;

    @ManyToOne(() => Chapter, (chapter) => chapter.shortQuestions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'chapterId' })
    chapter: Chapter;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
