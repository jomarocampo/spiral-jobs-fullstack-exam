import { IsOptional, IsDefined, IsString, IsNotEmpty, IsBoolean, IsIn, IsInt, IsArray } from 'class-validator';

export class UserUpdateDto {

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly password: string;

  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  readonly is_deleted: boolean;
}

export class UserCreateDto {

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly password: string;
}

export class UserBatchDeleteDto {

  @IsArray()
  @IsDefined()
  readonly ids: number[];
}
