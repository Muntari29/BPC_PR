import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/singin-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        readonly UserService: UserService,
        readonly AuthService: AuthService
        ){}

    //SignUp
    @Post('signUp')
    create(@Body() data: CreateUserDto){
        console.log('controller start!');
        return this.UserService.create(data);
    }

    //SignIn
    @Post('signIn')
    async signIn(@Body() data: SignInDto){
        console.log('controller_start!');
        const result = await this.UserService.singIn(data);
        return await this.AuthService.login(result);
    }
    
    //findUser
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findUser(@Param('id') userId: Number){
        console.log('111111111');
        return this.UserService.findUser(userId);
    }
}
