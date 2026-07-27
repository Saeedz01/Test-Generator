import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { schoolClass } from '../../class/entities/class.entity';
import { Book } from '../../book/entities/book.entity';
import { Chapter } from '../../chapter/entities/chapter.entity';

@Entity('long_questions')
export class LongQuestion {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255 })
    question_text!: string;

    @ManyToOne(() => schoolClass, (cls) => cls.questions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'classId' })
    class!: schoolClass;

    @ManyToOne(() => Book, (book) => book.questions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'bookId' })
    book!: Book;

    @ManyToOne(() => Chapter, (chapter) => chapter.questions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'chapterId' })
    chapter!: Chapter;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}
