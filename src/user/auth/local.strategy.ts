import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from 'src/user/dto/singin-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(data:SignInDto): Promise<any> {
    const { email, password } = data;
    console.log('aaaaaaaaa');
    console.log(email);
    console.log(password);
    const user = await this.authService.validateUser(data);
    console.log(user);
    console.log(data);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}