import { IsEmail } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
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
    phone_number!: number;

    @Column()
    image_url: string;
}