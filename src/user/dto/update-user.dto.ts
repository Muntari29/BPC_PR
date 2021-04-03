import { IsString } from "class-validator";

export class UpdateUserDto {
    // 값이 문자열인지 확인
    @IsString()
    readonly nick_name?: string;
}