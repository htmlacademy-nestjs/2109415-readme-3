import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { DEFAULT_COMMENT_COUNT_LIMIT } from '../comment.constant';

export class CommentQuery {
  @Transform(({ value }) => +value || DEFAULT_COMMENT_COUNT_LIMIT)
  @IsNumber()
  @IsOptional()
  public limit = DEFAULT_COMMENT_COUNT_LIMIT;

  @Transform(({ value }) => +value)
  @IsOptional()
  public page: number;
}
