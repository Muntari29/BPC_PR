import { UpdateUserDto } from './dto/update-user.dto';
import { SignInDto } from './dto/singin-user.dto';
import { BadRequestException, Injectable, NotFoundException, HttpException, ExceptionFilter, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getRepository, Repository, SimpleConsoleLogger } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private usersRepository: Repository<UserRepository>,
        private connection: Connection
    ) {}
    // SignUp
    async create(data: CreateUserDto): Promise<any>{
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
        
        await this.usersRepository.save([createUser]);
        return `SignUp Success : ${createUser.email}`;
    }
    
    //SignIn
    async singIn(data: SignInDto): Promise<any>{
        const { email, password } = data;
        try{
            const getUser = await getRepository('User').createQueryBuilder('user').where({email:email}).getRawOne();
            if (await argon2.verify(getUser.user_password, password)) {
                return getUser;
            } else {
                throw new BadRequestException('Not_found_user');
            }
        } catch(error) {
            //email and password validation
            throw new BadRequestException('Not_found_user33');
        }
    }

    // token validation test
    async findUser(id: number): Promise<any>{
        const user = await getRepository("User").createQueryBuilder('user').where({id}).getRawOne();
        if (!user) {
            throw new NotFoundException('Not_found_findUser');
        }
        return {
            id: user.user_id,
            real_name: user.user_real_name,
            nick_name: user.user_nick_name,
            email: user.user_email
        };
    }

    // Update User Nick_name
    async upDate(userId: number, upDateData: UpdateUserDto): Promise<any>{
        // userId validation
        const user = await this.findUser(userId);
        const nickName = await getRepository("User").createQueryBuilder('user').where({nick_name: upDateData.nick_name}).getRawOne();
        
        // nick_name overlap validation
        if (!nickName){
            const upDateName = await getRepository("User")
            .createQueryBuilder('user')
            .update(User)
            .set({
                nick_name: upDateData.nick_name
            })
            .where("id = :id", { id:userId})
            .execute();
            return `Befor : ${user.nick_name} => After: ${upDateData.nick_name}`;
        } else {
            throw new ConflictException('Alerdy_nick_name');
        }
    }

    // Delete User
    async deleteUser(userId: number): Promise<any>{
        // userId validation
        const user = await this.findUser(userId);
        await this.usersRepository.delete(userId);
        return `Delete User Success : ${userId}`
    }
}
