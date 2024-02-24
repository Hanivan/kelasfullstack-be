import { formDatasStringBooleanParse } from '@libs/helpers/validators/string-to-boolean';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password: string;

  @IsString()
  @IsOptional()
  avatar_url: string; // will set at service layer

  @IsString()
  @IsOptional()
  cover_url: string; // will set at service layer

  @Transform(formDatasStringBooleanParse)
  @IsBoolean()
  @IsOptional()
  n_status: number;

  @IsString()
  @IsOptional()
  @MaxLength(2500)
  bio: string;

  @IsOptional()
  @MaxLength(255)
  title: string;
}
