import { UpdateUserDto } from './dto/update-user.dto';
import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
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
    async findUser(@Param('id') userId: number){
        console.log('111111111');
        return this.UserService.findUser(userId);
    }

    // Update User Nick_name
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async upDateUser(@Param('id') userId: number, @Body() upDateData: UpdateUserDto){
        console.log('22222222');
        return await this.UserService.upDate(userId, upDateData);
    }
}
