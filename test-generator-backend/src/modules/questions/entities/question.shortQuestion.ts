import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { schoolClass } from '../../class/entities/class.entity';
import { Book } from '../../book/entities/book.entity';
import { Chapter } from '../../chapter/entities/chapter.entity';

@Entity('questions')
export class ShortQuestion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    question_text: string;

    // @Column({ name: 'classId', type: 'uuid', nullable: true })
    // classId: string;

    // @Column({ name: 'bookId', type: 'uuid', nullable: true })
    // bookId: string;

    // @Column({ name: 'chapterId', type: 'uuid', nullable: true })
    // chapterId: string;

    @ManyToOne(() => schoolClass, (cls) => cls.questions)
    @JoinColumn({ name: 'classId' })
    class: schoolClass;

    @ManyToOne(() => Book, (book) => book.questions)
    @JoinColumn({ name: 'bookId' })
    book: Book;

    @ManyToOne(() => Chapter, (chapter) => chapter.questions)
    @JoinColumn({ name: 'chapterId' })
    chapter: Chapter;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
