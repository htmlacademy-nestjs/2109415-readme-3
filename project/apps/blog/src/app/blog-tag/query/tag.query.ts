import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { BLOG_TAG_LENGTH } from '../blog-tag.constant';

export class TagQuery {
  @IsString()
  @MinLength(BLOG_TAG_LENGTH.MIN)
  @MaxLength(BLOG_TAG_LENGTH.MAX)
  @IsOptional()
  public tag: string;
}
