import { IsString } from 'class-validator';

export class SearchingTextQuery {
  @IsString()
  public searchingText: string;
}
