import { IsString, MaxLength, MinLength } from 'class-validator';
import { PASSWORD_LENGTH } from '../authentication.constant';

export class changePassDto {
  @IsString()
  public id: string;

  @IsString()
  public oldPassword: string;

  @IsString()
  @MinLength(PASSWORD_LENGTH.Min)
  @MaxLength(PASSWORD_LENGTH.Max)
  public newPassword: string;
}
