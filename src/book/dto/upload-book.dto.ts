import { IsDate, IsDateString, IsNotEmpty, IsUrl } from 'class-validator';
import { Entity} from 'typeorm';

@Entity('Book')
export class UploadBookDto {
    @IsNotEmpty()
    readonly title!: string;

    @IsNotEmpty()
    @IsUrl()
    image_url!: string;

    @IsNotEmpty()
    contents!: string;

    @IsNotEmpty()
    @IsDateString()
    datetime!: string;
}