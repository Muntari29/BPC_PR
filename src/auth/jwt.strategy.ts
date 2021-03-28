import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly AuthService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  // controller에 @UseGuards(JwtAuthGuard) 붙은 메서드들은 여기를 사전에 거쳐서 검증을 한다.
  async validate(payload: any) {
    console.log('jwt_startege.ts');
    const account = await this.AuthService.validateUser(payload);
    if (!account){
      throw new UnauthorizedException('JWT_Unauth');
    }
    return account;
  }
}