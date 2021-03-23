import { SignInDto } from './dto/singin-user.dto';
import { BadRequestException, Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getRepository, Repository, SimpleConsoleLogger } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import * as argon2 from 'argon2';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private usersRepository: Repository<UserRepository>,
        private connection: Connection
    ) {}
    // SignUp
    async create(data: CreateUserDto): Promise<any>{
        console.log('post_service_start!')
        const {
            real_name,
            nick_name,
            email,
            password,
            phone_number,
            image_url
        } = data;
        const userEmail = await this.usersRepository.findOne({where :{email: email}});
        if (userEmail){
            throw new BadRequestException('Exists_user');
        }
        let createUser = new User()
        createUser.real_name = real_name
        createUser.nick_name = nick_name;
        createUser.email = email;
        createUser.password = password;
        createUser.phone_number = phone_number;
        createUser.image_url = image_url;

        return await this.usersRepository.save([createUser]);
    }
    
    //SignIn
    async singIn(data: SignInDto): Promise<any>{
        console.log('singin_sevice_start!')
        const { email, password } = data;
        try{
            const getUser = await getRepository('User').createQueryBuilder('user').where({email:email}).getRawOne();
            if (await argon2.verify(getUser.user_password, password)) {
                console.log('signin_ok');
                return getUser;
            } else {
                console.log('signin_fail')
                throw new BadRequestException('Not_found_user');
            }
        } catch(error) {
            //email and password validation
            throw new BadRequestException('Not_found_user33');
        }
    }

    // token validation test
    async findUser(id: Number): Promise<any>{
        console.log('findUser_start');
        const user = await getRepository("User").createQueryBuilder('user').where({id}).getRawOne();
        if (!user) {
            throw new NotFoundException('Not_found_findUser');
        }
        return {
            email: user.user_email,
            id: user.user_id
        };
    }
}
