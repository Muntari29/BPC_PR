import { UpdateUserDto } from './dto/update-user.dto';
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Redirect, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/singin-user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
    constructor(
        readonly UserService: UserService,
        ){}

    //SignUp
    @Post('signUp')
    async create(@Body() data: CreateUserDto){
        return await this.UserService.create(data);
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