import { UploadBookDto } from './dto/upload-book.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { BookRepository } from './book.repository';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(BookRepository)
        private bookRepository: Repository<BookRepository>,
        private connection: Connection
    ) {}

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
}
