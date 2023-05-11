import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddNewCommentDto {
  @ApiProperty({
    description: 'Text of comment',
    example: 'Hello everybody',
  })
  @IsString()
  public message: string;

  @ApiProperty({
    description: 'ID of post',
    example: 5,
  })
  @IsNumber()
  public postId: number;
}
