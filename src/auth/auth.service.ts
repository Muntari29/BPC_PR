import { getRepository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from 'src/user/dto/singin-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService) {}
    
    // Token email check
    async validateUser(payload): Promise<Object> {
      console.log('auth_service!!!')
      const account = await this.userService.findUser(payload.sub);
      console.log(account);
      console.log(typeof(account));
      if (account.email == payload.email) {
        console.log(`validateAccount Success`);
        const {...result} = account;
        return result;
      }
      return null;
    }

    async singIn(data: SignInDto): Promise<Object>{
      console.log('auth_service_signin')
      const { email, password } = data;
      try{
          const getUser = await getRepository('User').createQueryBuilder('user').where({email:email}).getRawOne();
          if (await argon2.verify(getUser.user_password, password)) {
            const payload = { email: getUser.user_email, sub: getUser.user_id };
            return { 
              access_token: this.jwtService.sign(payload),
            };
          } else {
            throw new BadRequestException('Not_found_user');
          }
        } catch(error) {
          //email and password validation
          throw new BadRequestException('Not_found_user33');
        }
      }
}