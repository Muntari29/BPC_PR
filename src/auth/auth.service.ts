import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from 'src/user/dto/singin-user.dto';

@Injectable()
export class AuthService {
  constructor(
      private jwtService: JwtService) {}

  async validateUser(data:SignInDto): Promise<any> {
    console.log('auth_service!!!')
    console.log(data);
    // const user = await this.userService.singIn(data);
    // console.log('dsdssdsds');
    // if (user && user.password === data.password) {
    //   const { password, ...result } = user;
    //   return result;
    // }
    return null;
  }

  async login(getUser: any) {
    console.log('auth_service_logint');
    const payload = { email: getUser.user_email, sub: getUser.user_id };
    return { 
      access_token: this.jwtService.sign(payload),
    };
  }
}