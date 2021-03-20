import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(readonly UserService: UserService){}

    //SignUp
    @Post('post')
    create(@Body() data:CreateUserDto){
        console.log('controller start!');
        return this.UserService.create(data);
    }

    //findOneUser

    @Get(':id')
    findOne(@Param('id') userId: number){
        return this.UserService.findOne(userId)
    }
}
