import { LinkPostBody, PicturePostBody,  PostType, QuotePostBody, Tag, TextPostBody, postTypes } from "@project/shared/app-types";
import { Type } from "class-transformer";
import { ArrayMaxSize, Contains, IsArray, IsIn,  IsOptional,  IsString, IsUrl, MaxLength, MinLength, ValidateNested } from "class-validator";



class VideoPostDto {
  @IsString()
  @MinLength(20)
  @MaxLength(50)
  public title: string;

  @IsString()
  @IsUrl( undefined, { message: 'linkVideo URL is not valid.' })
  @Contains('.youtu')
  public linkVideo: string;

  public postId?: number;
}

export class AddNewPostDto {
  @IsIn(postTypes)
  public postType: PostType;

  @ValidateNested()
  @Type(() => VideoPostDto)
  public videoPost?: VideoPostDto;
  public textPost?: TextPostBody;
  public quotePost?: QuotePostBody;
  public picturePost?: PicturePostBody;
  public linkPost?: LinkPostBody;

  @IsArray()
  @ArrayMaxSize(8)
  @IsOptional()
  public tags?: number[];


  @IsString()
  public userId: string;
}