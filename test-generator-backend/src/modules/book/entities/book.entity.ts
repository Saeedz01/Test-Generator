import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { schoolClass } from 'src/modules/class/entities/class.entity';
import { Chapter } from 'src/modules/chapter/entities/chapter.entity';
import { LongQuestion } from 'src/modules/questions/entities/question.longQuestion';
import { ShortQuestion } from 'src/modules/questions/entities/question.shortQuestion';
import { McqQuestion } from 'src/modules/questions/entities/question.mcqs';

@Entity('books')
export class Book {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    book_name: string;

    @Column({ name: 'classId', type: 'uuid' })
    classId: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_At: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_At: Date;

    @ManyToOne(() => schoolClass, (cls) => cls.books)
    @JoinColumn({ name: 'classId' })
    class: schoolClass;

    @OneToMany(() => Chapter, (chapter) => chapter.book)
    chapters: Chapter[];

    @OneToMany(() => LongQuestion, (question) => question.book)
    questions: LongQuestion[];
    
    @OneToMany(() => ShortQuestion, (question) => question.book)
    shortQuestions: ShortQuestion[];
    
    @OneToMany(() => McqQuestion, (question) => question.book)
    mcqQuestions: McqQuestion[];
}
