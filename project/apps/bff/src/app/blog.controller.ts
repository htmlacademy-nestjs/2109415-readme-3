import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { HttpService } from '@nestjs/axios';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { UseridInterceptor } from './interceptors/userid.interceptor';
import { AddNewPostDto } from './dto/add-new-post.dto';
import { ApplicationServiceURL } from './app.config';
import { UpdateOldPostDto } from './dto/update-old-post.dto';
import { RequestWithTokenPayload } from '@project/shared/app-types';
import { AddNewCommentDto } from './dto/add-new-comment.dto';
import { CommentQuery } from './query/comment.query';
import { DEFAULT_COMMENT_COUNT_LIMIT } from './bff.constant';
import { PostQuery } from './query/post.query';
import { UserIdsDto } from './dto/user-ids.dto';
import { FindByTagsDto } from './dto/fing-by-tags.dto';
import { SearchingTextQuery } from './query/searching-text.query';
import { BlogService } from './blog.service';

@Controller('blog')
@UseFilters(AxiosExceptionFilter)
export class BlogController {
  constructor(
    private readonly httpService: HttpService,
    private readonly blogService: BlogService
  ) {}

  @UseGuards(CheckAuthGuard)
  @Post('/repost/:id')
  public async repost(
    @Param('id') id: string,
    @Req() { user: payload }: RequestWithTokenPayload
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/repost/${payload.sub}/${id}`
    );
    return data;
  }

  @Post('/findbytags')
  public async showByTags(@Body() tags: FindByTagsDto) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/findbytags`,
      tags
    );
    return data;
  }

  @Post('/findbytext')
  public async showByText(@Query() text: SearchingTextQuery) {
    return await this.blogService.findPostByText(text.searchingText);
  }

  @UseGuards(CheckAuthGuard)
  @Post('/comment')
  public async createComment(
    @Req() { user: payload }: RequestWithTokenPayload,
    @Body() dto: AddNewCommentDto
  ) {
    const newComment = {
      message: dto.message,
      userId: payload.sub,
      postId: dto.postId,
    };
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Comments}`,
      newComment
    );
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(UseridInterceptor)
  @Post('/')
  public async createPost(@Body() dto: AddNewPostDto) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/`,
      dto
    );
    await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/addpost/${dto.userId}`
    );
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Get('/feed')
  public async feedLine(
    @Req() { user: payload }: RequestWithTokenPayload,
    @Query() query: PostQuery
  ) {
    const userIdResponse = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Users}/${payload.sub}`
    );
    const userIdsDto = new UserIdsDto();
    userIdsDto.ids = [...userIdResponse.data.subscribe, payload.sub];
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Blog}/feed?limit=${
        query.limit != 0 ? query.limit : DEFAULT_COMMENT_COUNT_LIMIT
      }&page=${query.page ? query.page : 1}${
        query.sortType ? '&' + query.sortType : ''
      }`,
      userIdsDto
    );
    return data;
  }

  @Get('/:id')
  public async indexPost(@Param('id') id: string) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}/${id}`
    );
    return data;
  }

  @Get('/')
  public async showPosts(@Query() query: PostQuery) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}?limit=${
        query.limit != 0 ? query.limit : DEFAULT_COMMENT_COUNT_LIMIT
      }&page=${query.page ? query.page : 1}${
        query.sortType ? '&' + query.sortType : ''
      }`
    );
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @UseInterceptors(UseridInterceptor)
  @Patch('/:id')
  public async updatePost(
    @Param('id') id: string,
    @Body() dto: UpdateOldPostDto
  ) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}/${id}`
    );
    return await this.blogService.updatePost(data.userId, dto, id);
  }

  @UseGuards(CheckAuthGuard)
  @Delete('comment/:id')
  public async deleteComment(
    @Param('id') id: number,
    @Req() { user: payload }: RequestWithTokenPayload
  ) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Comments}/${id}`
    );
    await this.blogService.deleteComment(data.userId, payload.sub, id);
  }

  @UseGuards(CheckAuthGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deletePost(
    @Param('id') id: string,
    @Req() { user: payload }: RequestWithTokenPayload
  ) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Blog}/${id}`
    );
    await this.blogService.deletePost(data.userId, payload.sub, id);
  }

  @Get('comment/:postId')
  public async getComments(
    @Param('postId') postId,
    @Query() query: CommentQuery
  ) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Comments}/${postId}?limit=${
        query.limit != 0 ? query.limit : DEFAULT_COMMENT_COUNT_LIMIT
      }&page=${query.page ? query.page : 1}`
    );
    return data;
  }
}
