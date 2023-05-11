import { IsArray } from 'class-validator';

export class IdsDto {
  @IsArray()
  public ids: string[];
}
