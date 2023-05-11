import { ApiProperty } from '@nestjs/swagger';

export class FindByTagsDto {
  @ApiProperty()
  tags: string[];
}
