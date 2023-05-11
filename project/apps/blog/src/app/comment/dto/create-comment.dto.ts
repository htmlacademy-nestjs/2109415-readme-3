import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { COMMENT_MESSAGE_LENGTH } from '../comment.constant';

export class CreateComment {
  @IsString()
  @MinLength(COMMENT_MESSAGE_LENGTH.Min)
  @MaxLength(COMMENT_MESSAGE_LENGTH.Max)
  public message: string;

  @IsNotEmpty()
  @IsString()
  public userId: string;

  @IsNotEmpty()
  @IsNumber()
  public postId: number;
}
