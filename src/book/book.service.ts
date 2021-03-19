import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { BookRepository } from './book.repository';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(BookRepository)
        private usersRepository: Repository<BookRepository>,
        private connection: Connection
    ) {}
}
