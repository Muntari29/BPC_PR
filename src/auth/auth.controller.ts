
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SignInDto } from 'src/user/dto/singin-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        readonly AuthService:AuthService
    ){}

    //SignIn
    // response statuscode 201 -> 200, Post method default 201
    @HttpCode(200)
    @Post('signIn')
    async signIn(@Body() data: SignInDto){
        return await this.AuthService.singIn(data);
    }
}
