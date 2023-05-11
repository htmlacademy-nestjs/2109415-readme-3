import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { DEFAULT_POST_COUNT_LIMIT } from '../bff.constant';

export class PostQuery {
  @Transform(({ value }) => +value || DEFAULT_POST_COUNT_LIMIT)
  @IsNumber()
  @IsOptional()
  public limit = DEFAULT_POST_COUNT_LIMIT;

  @IsIn(['byRating', 'byComments'])
  @IsOptional()
  public sortType: 'byRating' | 'byComments' | undefined;

  @Transform(({ value }) => +value)
  @IsOptional()
  public page: number;
}
