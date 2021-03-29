import { UploadBookDto } from './dto/upload-book.dto';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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
    async upLoadBook(bookData:UploadBookDto): Promise<any>{
        const {
            title,
            image_url,
            contents,
            datetime
        } = bookData;
        console.log(title);
        const getBook = await this.bookRepository.findOne({where :{title: title}});
        console.log(getBook);
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
    async findBook(bookId: number): Promise<any>{
        const book = await this.bookRepository.findOne({where: {id: bookId}});
        if (!book){
            throw new NotFoundException('Not_found_book');
        }
        return book;
    }

    // searchBooks
    async searchBooks(bookTitle: string): Promise<any>{
        // find, where, like -> 문자열 포함 Search 기능 구현
        const {...books} = await this.bookRepository.find({where: {title: Like(`%${bookTitle}%`)}});

        // No matching title
        if (Object.keys(books).length == 0){
            return 'No matching results were found.';
        }
        return books;
    }
}
