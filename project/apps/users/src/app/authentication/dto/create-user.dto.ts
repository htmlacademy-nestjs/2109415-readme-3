import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsISO8601,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  AUTH_USER_DATE_BIRTH_NOT_VALID,
  AUTH_USER_EMAIL_NOT_VALID,
  NAME_LENGTH,
  PASSWORD_LENGTH,
} from '../authentication.constant';

export class CreateUserDto {
  @ApiProperty({
    description: 'User unique address',
    example: 'user@user.ru',
  })
  @IsEmail({}, { message: AUTH_USER_EMAIL_NOT_VALID })
  public email: string;

  @ApiProperty({
    description: 'User birth date',
    example: '1981-03-12',
  })
  @IsISO8601({}, { message: AUTH_USER_DATE_BIRTH_NOT_VALID })
  public dateBirth: string;

  @ApiProperty({
    description: 'User first name',
    example: 'Keks',
  })
  @IsString()
  @MinLength(NAME_LENGTH.Min)
  @MaxLength(NAME_LENGTH.Max)
  public firstname: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Ivanov',
  })
  @MinLength(NAME_LENGTH.Min)
  @MaxLength(NAME_LENGTH.Max)
  @IsString()
  public lastname: string;

  @ApiProperty({
    description: 'User password',
    example: '123456',
  })
  @MinLength(PASSWORD_LENGTH.Min)
  @MaxLength(PASSWORD_LENGTH.Max)
  @IsString()
  public password: string;
}
