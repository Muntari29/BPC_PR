import { IsEmail } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}