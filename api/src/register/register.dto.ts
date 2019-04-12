import { IsString, IsNotEmpty, IsDefined } from 'class-validator';

export class RegisterDto {

    @IsString()
    @IsDefined()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsDefined()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsDefined()
    @IsNotEmpty()
    readonly password: string;

    @IsString()
    @IsDefined()
    @IsNotEmpty()
    readonly confirm_password: string;
}