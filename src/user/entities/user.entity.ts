import { IsEmail } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import * as argon2 from 'argon2';

@Entity('User')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    real_name!: string;

    @Column()
    nick_name!: string;

    @Column()
    @IsEmail()
    email!: string;

    @Column()
    password!: string;

    @Column()
    phone_number!: string;

    @Column()
    image_url: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await argon2.hash(this.password, {type: argon2.argon2id, hashLength: 40});
    }
}