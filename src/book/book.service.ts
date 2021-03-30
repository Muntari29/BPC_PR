import { UploadBookDto } from './dto/upload-book.dto';
import { Injectable, BadRequestException, NotFoundException, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Like, Repository } from 'typeorm';
import { BookRepository } from './book.repository';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(BookRepository)
        private bookRepository: Repository<BookRepository>,
        private connection: Connection
    ) {}

    // upLoadBook
    async upLoadBook(bookData:UploadBookDto): Promise<string>{
        const {
            title,
            image_url,
            contents,
            datetime
        } = bookData;
        const getBook = await this.bookRepository.findOne({where :{title: title}});
        if (getBook){
            throw new BadRequestException('Exists_book');
        }
        let createBook = new Book()
        createBook.title = title;
        createBook.image_url = image_url;
        createBook.contents = contents;
        createBook.datetime = datetime;
        
        await this.bookRepository.save([createBook]);
        return `UpLoad Success : ${createBook.title}`;
    }

    // findbook
    async findBook(bookId: number): Promise<BookRepository>{
        const book = await this.bookRepository.findOne({where: {id: bookId}});
        if (!book){
            throw new NotFoundException('Not_found_book');
        }
        return book;
    }

    // searchBooks
    async searchBooks(bookTitle: string): Promise<BookRepository[] | string>{
        // find, where, like -> 문자열 포함 Search 기능 구현
        const books = await this.bookRepository.find({
            skip: 0,
            take: 5,
            where: {title: Like(`%${bookTitle}%`)}
        });

        // No matching title
        if (Object.keys(books).length == 0){
            return 'No matching results were found.';
        }
        return books;
    }

    // getall use offset, limit
    async getAll(offset: number, limit: number): Promise<BookRepository[] | null>{
        if (offset >= limit){
            throw new BadRequestException('check offset&limit');
        }
        const bookData = await this.bookRepository.find({
            skip: (offset-1) * limit,
            take: limit
        })
        if (!bookData){
            return null;
        } else {
            return bookData;
        }
    }

    // deleteBook
    async deleteBook(bookId: number): Promise<string>{
        // bookId validation
        const book = await this.findBook(bookId);
        await this.bookRepository.delete(bookId);
        return `Delete Book Success : ${bookId}`;

    }
}
