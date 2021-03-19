import { EntityRepository, Repository } from 'typeorm';
import { Book } from './entities/book.entity';

@EntityRepository(Book)
export class BookRepository extends Repository<Book> {}