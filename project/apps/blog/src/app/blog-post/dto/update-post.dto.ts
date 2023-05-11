import {
  LinkPostBody,
  PicturePostBody,
  QuotePostBody,
  TextPostBody,
  VideoPostBody,
} from '@project/shared/app-types';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  Contains,
  IsArray,
  IsBoolean,
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
} from '../blog-post.constant';

class VideoPostDto implements VideoPostBody {
  @IsString()
  @MinLength(VIDEO_TITLE_LENGTH.Min)
  @MaxLength(VIDEO_TITLE_LENGTH.Max)
  public title: string;

  @IsString()
  @IsUrl(undefined, { message: 'linkVideo URL is not valid.' })
  @Contains('.youtu')
  public linkVideo: string;
}

class TextPostDto implements TextPostBody {
  @IsString()
  @MinLength(TEXT_POST_NAME_LENGTH.Min)
  @MaxLength(TEXT_POST_NAME_LENGTH.Max)
  public name: string;

  @IsString()
  @MinLength(TEXT_POST_ANNOUNCEMENT_LENGTH.Min)
  @MaxLength(TEXT_POST_ANNOUNCEMENT_LENGTH.Max)
  public announcement: string;

  @IsString()
  @MinLength(TEXT_POST_TEXT_LENGTH.Min)
  @MaxLength(TEXT_POST_TEXT_LENGTH.Max)
  public text: string;
}

class QuotePostDto implements QuotePostBody {
  @IsString()
  @MinLength(QUOTE_POST_TEXT_LENGTH.Min)
  @MaxLength(QUOTE_POST_TEXT_LENGTH.Max)
  public text: string;

  @IsString()
  @MinLength(QUOTE_POST_AUTOR_LENGTH.Min)
  @MaxLength(QUOTE_POST_AUTOR_LENGTH.Max)
  public autor: string;
}

class PicturePostDto implements PicturePostBody {
  @IsString()
  @IsNotEmpty()
  public picture: string;
}

class LinkPostDto implements LinkPostBody {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  link: string;

  @IsOptional()
  options?: string;
}

export class UpdatePostDto {
  @ValidateNested()
  @Type(() => VideoPostDto)
  public videoPost?: VideoPostDto;

  @ValidateNested()
  @Type(() => TextPostDto)
  public textPost?: TextPostDto;

  @ValidateNested()
  @Type(() => QuotePostDto)
  public quotePost?: QuotePostDto;

  @ValidateNested()
  @Type(() => PicturePostDto)
  public picturePost?: PicturePostDto;

  @ValidateNested()
  @Type(() => LinkPostDto)
  public linkPost?: LinkPostDto;

  @IsArray()
  @ArrayMaxSize(8)
  @IsOptional()
  public tags?: number[];

  @IsString()
  @IsOptional()
  public userId?: string;

  @IsBoolean()
  @IsOptional()
  public idDraft?: boolean;

  @IsNumber()
  @IsOptional()
  public originalPostId?: number;
}
