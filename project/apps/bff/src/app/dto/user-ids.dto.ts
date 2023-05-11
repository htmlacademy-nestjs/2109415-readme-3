import { ApiProperty } from '@nestjs/swagger';

export class UserIdsDto {
  @ApiProperty()
  ids: string[];
}
