import { SignInDto } from './dto/singin-user.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository, SimpleConsoleLogger } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

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

    //findOneUser
    async findOne(email: any): Promise<any>{
        console.log('findOne_service_start!')
        const getUser = await this.usersRepository.findOne({where: {email: email.email}});
        console.log(getUser)
        if (!getUser){
            throw new NotFoundException('Not_find_user');
        }
        return getUser;
    }

    //SignIn
    async singIn(data: SignInDto): Promise<any>{
        console.log('singin_sevice_start!')
        const { email, password } = data;
        console.log(data);
        console.log(email);
        console.log(password);
        const userEmail = await this.usersRepository.findOne({where: {email:email}});
        const userPass = await this.usersRepository.findOne({where: {password:password}});
        if (!userEmail){
            throw new NotFoundException('Not_found_user');
        }
        if (!userPass){
            throw new BadRequestException('Not_found_user');
        }
        return {statusCode: 200};
    }
}
