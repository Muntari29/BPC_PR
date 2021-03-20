import { IsEmail, IsMobilePhone, IsNotEmpty, isURL, IsUrl } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    readonly real_name: string;
    
    @IsNotEmpty()
    readonly nick_name: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;

    @IsNotEmpty()
    readonly phone_number: string;

    @IsUrl()
    readonly image_url: string;
}