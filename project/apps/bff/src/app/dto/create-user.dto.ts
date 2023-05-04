import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsISO8601, IsString, MaxLength, MinLength } from 'class-validator';
import { AUTH_USER_DATE_BIRTH_NOT_VALID, AUTH_USER_EMAIL_NOT_VALID } from "./dto.constant";

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
  @MinLength(3)
  @MaxLength(50)
  public firstname: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Ivanov'
  })
  @MinLength(3)
  @MaxLength(50)
  @IsString()
  public lastname: string;

  @ApiProperty({
    description: 'User password',
    example: '123456'
  })
  @MinLength(6)
  @MaxLength(12)
  @IsString()
  public password: string;
}

