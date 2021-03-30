import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private usersRepository: Repository<UserRepository>,
        private connection: Connection
    ) {}
    // SignUp
    async create(data: CreateUserDto): Promise<string>{
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
    async upDate(userId: number, upDateData: UpdateUserDto): Promise<string>{
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
    async deleteUser(userId: number): Promise<string>{
        // userId validation
        const user = await this.findUser(userId);
        await this.usersRepository.delete(userId);
        return `Delete User Success : ${userId}`
    }
}
