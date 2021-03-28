import { UploadBookDto } from './dto/upload-book.dto';
import { Body, Controller, Post, Request } from '@nestjs/common';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
    constructor(
        readonly BookService:BookService
    ){}

    @Post('post')
    upLoad(@Body() bookData:UploadBookDto){
        return this.BookService.upLoadBook(bookData);
    }
}
