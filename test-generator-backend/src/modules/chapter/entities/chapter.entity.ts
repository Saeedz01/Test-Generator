import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
  } from 'typeorm';
  
  import { schoolClass } from '../../class/entities/class.entity';
  import { Book } from '../../book/entities/book.entity';
  import { LongQuestion } from '../../questions/entities/question.longQuestion';
  @Entity('chapters')
  export class Chapter {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => schoolClass, (schoolClass) => schoolClass.chapters, {
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'classId' })
    class: schoolClass;
  
    @ManyToOne(() => Book, (book) => book.chapters, {
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'bookId' })
    book: Book;

    @OneToMany(() => LongQuestion, (question) => question.chapter)
    questions: LongQuestion[];
  
    @Column({ type: 'varchar', length: 255 })
    chapter_name: string;
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  }