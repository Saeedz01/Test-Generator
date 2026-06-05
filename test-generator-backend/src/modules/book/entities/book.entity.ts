import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { schoolClass } from 'src/modules/class/entities/class.entity';
import { Chapter } from 'src/modules/chapter/entities/chapter.entity';
import { Question } from 'src/modules/questions/entities/question.longQuestion';

@Entity('books')
export class Book {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    book_name: string;

    @Column({ name: 'classId', type: 'uuid' })
    classId: string;

    @ManyToOne(() => schoolClass, (cls) => cls.books)
    @JoinColumn({ name: 'classId' })
    class: schoolClass;

    @OneToMany(() => Chapter, (chapter) => chapter.book)
    chapters: Chapter[];

    @OneToMany(() => Question, (question) => question.book)
    questions: Question[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_At: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_At: Date;
}