import { UploadBookDto } from './dto/upload-book.dto';
import { Injectable, BadRequestException, NotFoundException, Delete, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Like, Repository, getRepository, getConnection, QueryFailedError } from 'typeorm';
import { BookRepository } from './book.repository';
import { Book } from './entities/book.entity';
import { User } from 'src/user/entities/user.entity';

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

    // Add BPC
    async addBpc(req: any, bookTitle: string): Promise<any>{
        const userId = req.user.id;
        const bookId = await getRepository('Book')
        .createQueryBuilder('book')
        .where({title:bookTitle})
        .getRawOne()

        // bookId validation
        if (!bookId){
            throw new NotFoundException('Not_found_book');
        }

        // userId validation
        const user = await getRepository('User')
        .createQueryBuilder('user')
        .where({id: userId})
        .getRawOne()

        let userdata = new User();
        userdata.id = user.user_id;
        userdata.real_name = user.user_real_name;
        userdata.nick_name = user.user_nick_name;
        userdata.email = user.user_email;
        userdata.password = user.user_password;
        userdata.image_url = user.user_image_url;
        
        let bookBpc = new Book();
        bookBpc.id = bookId.book_id;
        bookBpc.title = bookId.book_title;
        bookBpc.image_url = bookId.book_image_url;
        bookBpc.contents = bookId.book_contents;
        bookBpc.datetime = bookId.book_datetime;
        bookBpc.users = [user];

        // QueryFailedError validation (Duplicate PK)
        try{
            await getConnection()
            .createQueryBuilder()
            .relation(Book, "users")
            .of(bookBpc)
            .add(userdata);

            return 'Success_Add_book';
        } catch(e){
            console.log('QueryFaildError');
            throw new BadRequestException('QueryfaildError_Duplicate PK');
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
