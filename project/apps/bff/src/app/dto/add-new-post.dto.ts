import {
  LinkPostBody,
  PicturePostBody,
  PostType,
  QuotePostBody,
  TextPostBody,
  VideoPostBody,
  postTypes,
} from '@project/shared/app-types';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  Contains,
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  QUOTE_POST_AUTOR_LENGTH,
  QUOTE_POST_TEXT_LENGTH,
  TEXT_POST_ANNOUNCEMENT_LENGTH,
  TEXT_POST_NAME_LENGTH,
  TEXT_POST_TEXT_LENGTH,
  VIDEO_TITLE_LENGTH,
} from '../bff.constant';
import { ApiProperty } from '@nestjs/swagger';

class VideoPostDto implements VideoPostBody {
  @ApiProperty()
  @IsString()
  @MinLength(VIDEO_TITLE_LENGTH.Min)
  @MaxLength(VIDEO_TITLE_LENGTH.Max)
  public title: string;

  @ApiProperty()
  @IsString()
  @IsUrl(undefined, { message: 'linkVideo URL is not valid.' })
  @Contains('.youtu')
  public linkVideo: string;
}

class TextPostDto implements TextPostBody {
  @ApiProperty()
  @IsString()
  @MinLength(TEXT_POST_NAME_LENGTH.Min)
  @MaxLength(TEXT_POST_NAME_LENGTH.Max)
  public name: string;

  @ApiProperty()
  @IsString()
  @MinLength(TEXT_POST_ANNOUNCEMENT_LENGTH.Min)
  @MaxLength(TEXT_POST_ANNOUNCEMENT_LENGTH.Max)
  public announcement: string;

  @ApiProperty()
  @IsString()
  @MinLength(TEXT_POST_TEXT_LENGTH.Min)
  @MaxLength(TEXT_POST_TEXT_LENGTH.Max)
  public text: string;
}

class QuotePostDto implements QuotePostBody {
  @ApiProperty()
  @IsString()
  @MinLength(QUOTE_POST_TEXT_LENGTH.Min)
  @MaxLength(QUOTE_POST_TEXT_LENGTH.Max)
  public text: string;

  @ApiProperty()
  @IsString()
  @MinLength(QUOTE_POST_AUTOR_LENGTH.Min)
  @MaxLength(QUOTE_POST_AUTOR_LENGTH.Max)
  public autor: string;
}

class PicturePostDto implements PicturePostBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public picture: string;
}

class LinkPostDto implements LinkPostBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  link: string;

  @ApiProperty()
  @IsOptional()
  options?: string;
}

export class AddNewPostDto {
  @ApiProperty({
    description: 'Type of the post video or text etc',
    example: 'video',
  })
  @IsIn(postTypes)
  public postType: PostType;

  @ApiProperty()
  @ValidateNested()
  @Type(() => VideoPostDto)
  public videoPost?: VideoPostDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => TextPostDto)
  public textPost?: TextPostDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => QuotePostDto)
  public quotePost?: QuotePostDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => PicturePostDto)
  public picturePost?: PicturePostDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => LinkPostDto)
  public linkPost?: LinkPostDto;

  @ApiProperty({
    description: 'Array of tag ids',
    example: [1, 3, 4],
  })
  @IsArray()
  @ArrayMaxSize(8)
  @IsOptional()
  public tags?: number[];

  @ApiProperty()
  @IsString()
  public userId: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public idDraft: boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public originalPostId: number;
}
