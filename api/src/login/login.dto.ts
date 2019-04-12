import { IsDefined, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly password: string;
}
