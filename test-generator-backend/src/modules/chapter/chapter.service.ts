import { Injectable, NotFoundException,ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chapter } from './entities/chapter.entity';
import { schoolClass} from '../class/entities/class.entity';
import { Book } from '../book/entities/book.entity';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';

@Injectable()
export class ChapterService {
  constructor(
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,

    @InjectRepository(schoolClass)
    private schoolClassRepository: Repository<schoolClass>,

    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async create(createChapterDto: CreateChapterDto) {
    const { classId, bookId, chapter_name } = createChapterDto;
    //check if chapter already exists
    const existingChapter = await this.chapterRepository.findOne({
      where: { chapter_name, class: { id: classId }, book: { id: bookId } },
    });
    if (existingChapter) {
      throw new ConflictException('Chapter already exists');
    }

    const schoolClass = await this.schoolClassRepository.findOne({
      where: { id: classId },
    });
    if (!schoolClass) {
      throw new NotFoundException('Class not found');
    }

    const book = await this.bookRepository.findOne({
      where: { id: bookId },
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    //create chapter
    const chapter = this.chapterRepository.create({
      chapter_name,
      class: schoolClass,
      book: book,
    });

    return await this.chapterRepository.save(chapter);
  }

  async findAll() {
    const chapters = await this.chapterRepository.find();
    if (!chapters) {
      throw new NotFoundException('Chapters not found');
    }
    return chapters;
  }

  async findOne(id: string) {
    const chapter = await this.chapterRepository.findOne({
      where: { id:id },
    });
    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }
    return chapter;
  }

  update(id: number, updateChapterDto: UpdateChapterDto) {
    return `This action updates a #${id} chapter`;
  }

  async remove(id: string) {
    const chapter = await this.chapterRepository.delete({ id });
    if (chapter.affected === 0) {
      throw new NotFoundException('Chapter not found');
    }
    return chapter;
  }
}
