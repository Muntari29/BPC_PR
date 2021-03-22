import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/singin-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(readonly UserService: UserService){}

    //SignUp
    @Post('signUp')
    create(@Body() data: CreateUserDto){
        console.log('controller start!');
        return this.UserService.create(data);
    }

    //SignIn
    @Post('signIn')
    signIn(@Body() data: SignInDto){
        console.log('controller_start!');
        return this.UserService.singIn(data);
    }
}
