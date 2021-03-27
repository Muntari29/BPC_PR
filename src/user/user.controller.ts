import { UpdateUserDto } from './dto/update-user.dto';
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Redirect, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/singin-user.dto';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
    constructor(
        readonly UserService: UserService,
        readonly AuthService: AuthService
        ){}

    //SignUp
    @Post('signUp')
    create(@Body() data: CreateUserDto){
        return this.UserService.create(data);
    }

    //SignIn
    // response statuscode 201 -> 200, Post method default 201
    @HttpCode(200)
    @Post('signIn')
    async signIn(@Body() data: SignInDto){
        const result = await this.UserService.singIn(data);
        return await this.AuthService.login(result);
    }
    
    //findUser
    // userId = jwt payload
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findUser(@Param('id') userId: number){
        return await this.UserService.findUser(userId)
    }

    // Update User Nick_name
    @UseGuards(JwtAuthGuard)
    // redirect example , default statuscode = 302
    // @Redirect("https://changhoi.github.io", 302)
    @Patch(':id')
    async upDateUser(@Param('id') userId: number, @Body() upDateData: UpdateUserDto){
        return await this.UserService.upDate(userId, upDateData);
    }

    // Delete User
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteUser(@Param('id') userId: number){
        return await this.UserService.deleteUser(userId);
    }
}