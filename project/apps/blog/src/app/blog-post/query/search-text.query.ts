import { IsString } from 'class-validator';

export class SearchTextQuery {
  @IsString()
  public searchingText: string;
}
