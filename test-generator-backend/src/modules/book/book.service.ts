import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ERROR_MESSAGES } from 'src/common/constant/error-messages';
import { Book } from './entities/book.entity';
import { schoolClass } from 'src/modules/class/entities/class.entity';  

@Injectable()
export class BookService {

  constructor(
    
  // When the NestJS application starts, TypeORM registers the Book entity
  // and creates a repository for it, which acts as a ready-to-use interface for interacting with the books table.
  // When this service is instantiated, the NestJS dependency injection container checks this constructor
  // and sees that it requires a Book repository via @InjectRepository(Book).
  // The container then retrieves the pre-created Book repository and injects it into this variable(bookRepository),
  // making bookRepository capable of performing direct database operations like find, save, update, and delete.
    @InjectRepository(Book) 
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(schoolClass)
    private readonly classRepository: Repository<schoolClass>
  ) {}
  
  // book service methods
  async createBook(createBookDto: CreateBookDto) {
    const schoolClassRecord = await this.classRepository.findOne({
      where: {
        name: createBookDto.class_name,
      },
    });

    if (!schoolClassRecord) {
      throw new NotFoundException(ERROR_MESSAGES.CLASS_NOT_FOUND);
    }

    const book = this.bookRepository.create({
      book_name: createBookDto.book_name,
      description: createBookDto.description,
      edition: createBookDto.edition,
      class: schoolClassRecord,
    });

    return await this.bookRepository.save(book);
  }

  async findAll(classId?: string) {
    const query = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.class', 'class')
      .loadRelationCountAndMap('book.chaptersCount', 'book.chapters')
      .orderBy('book.book_name', 'ASC');

    if (classId) {
      query.andWhere('class.id = :classId', { classId });
    }

    const books = await query.getMany();

    if (!books.length) {
      // return empty array instead of 404 so clients can handle empty lists gracefully
      return [];
    }

    // map to include convenient fields expected by frontend (classId and class_name)
    return books.map((book) => ({
      ...book,
      classId: book.class?.id,
      class_name: book.class?.name,
      chaptersCount: Number(
        (book as Book & { chaptersCount?: number }).chaptersCount ?? 0,
      ),
    }));
  }

  async findOne(id: string) {
  const book = await this.bookRepository.findOne({
    where: { id },
    relations: { class: true },
    // relations: {
    //   chapters: true,
    //   questions: true,
    // },
  });

  if (!book) {
    throw new NotFoundException(ERROR_MESSAGES.BOOK_NOT_FOUND);
  }

  return {
    ...book,
    classId: book.class?.id,
    class_name: book.class?.name,
  };
}

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  async remove(id: string): Promise<void> {
  const result = await this.bookRepository.delete(id);

  if (result.affected === 0) {
    throw new NotFoundException(ERROR_MESSAGES.BOOK_NOT_FOUND);
  }
}

}
