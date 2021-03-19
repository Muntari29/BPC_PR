import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity('Book')
export class Book {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    image_url!: string;

    @Column()
    contents!: string;

    @Column({ type: 'datetime'})
    datetime!: string;

    @ManyToMany(() => User)
    @JoinTable()
    users: User[];
}