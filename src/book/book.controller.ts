import { UploadBookDto } from './dto/upload-book.dto';
import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('book')
export class BookController {
    constructor(
        readonly BookService:BookService
    ){}

    @Post('post')
    upLoad(@Body() bookData:UploadBookDto){
        return this.BookService.upLoadBook(bookData);
    }
    
    // No jwt authorization
    @Get('search')
    searchBooks(@Query('title') bookTitle: string){
        return this.BookService.searchBooks(bookTitle);
    }

    // getAll books
    @Get('all')
    getAll(@Query('offset') offset: number, @Query('limit') limit: number){
        return this.BookService.getAll(offset, limit);
    }

    // findUser BPC
    @UseGuards(JwtAuthGuard)
    @Get('find')
    findBpc(@Req() req:any){
        console.log(req);
        console.log(req.user.id);
        return this.BookService.findBpc(req);
    }

    @UseGuards(JwtAuthGuard)
    @Post('bpc')
    savebpc(@Req() req: any, @Query('title') bookTitle: string){
        return this.BookService.addBpc(req, bookTitle);
    }


    // search를 :id 보다 상위에 위치시켜야함
    // :id가 상단에 배치 될 경우 search를 id로 받아 들임
    // 일반적으로 정적 경로를 맨 위에 배치 한 다음 동적 경로(:)를 지정하고 모두 잡은 다음 오류 처리기를 사용하는 것이다.
    // 이는 express js에서도 동일하게 적용되는 개념이다.
    @Get(':id')
    findBook(@Param('id') bookId: number){
        return this.BookService.findBook(bookId);
    }

    @Delete(':id')
    deleteBook(@Param('id') bookId: number){
        return this.BookService.deleteBook(bookId);
    }
}
