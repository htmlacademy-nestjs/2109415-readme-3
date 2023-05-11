import { IsString, MaxLength, MinLength } from 'class-validator';
import { BLOG_TAG_LENGTH } from '../blog-tag.constant';

export class CreateTagDto {
  @IsString()
  @MinLength(BLOG_TAG_LENGTH.MIN)
  @MaxLength(BLOG_TAG_LENGTH.MAX)
  public text: string;
}
