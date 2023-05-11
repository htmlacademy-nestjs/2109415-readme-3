import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { PASSWORD_LENGTH } from './dto.constant';

export class NewPassDto {
  @ApiProperty()
  public oldPassword: string;

  @ApiProperty()
  @MinLength(PASSWORD_LENGTH.Min)
  @MaxLength(PASSWORD_LENGTH.Max)
  @IsString()
  public password: string;
}
