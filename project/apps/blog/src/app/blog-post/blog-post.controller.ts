import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { fillObject } from '@project/util/util-core';
import { PostRdo } from './rdo/post.rdo';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostQuery } from './query/post.query';
import { IdsDto } from './dto/ids.dto';
import { FindByTagsDto } from './dto/find-by-tags.dto';
import { SearchTextQuery } from './query/search-text.query';

@Controller('posts')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Get('/:id')
  async show(@Param('id', ParseIntPipe) id: number) {
    const post = await this.blogPostService.getPost(id);
    return {
      ...fillObject(PostRdo, post),
      commentsLength: post.comments.length,
      favoriteLength: post.favorite.length,
    };
  }

  @Get('/')
  async index(@Query() query: PostQuery) {
    const posts = await this.blogPostService.getPosts(query);
    return fillObject(PostRdo, posts);
  }

  @Post('/feed')
  async showFeed(@Query() query: PostQuery, @Body() ids: IdsDto) {
    const posts = this.blogPostService.getMyFeedPosts(query, ids.ids);
    return fillObject(PostRdo, posts);
  }

  @Post('/findbytags')
  async showByTags(@Body() tags: FindByTagsDto) {
    const posts = this.blogPostService.getPostsByTags(tags.tags);
    return fillObject(PostRdo, posts);
  }

  @Post('/findbytext')
  async showByText(@Query() text: SearchTextQuery) {
    const posts = this.blogPostService.getPostByName(text.searchingText);
    return fillObject(PostRdo, posts);
  }

  @Post('/repost/:userId/:postId')
  async repost(
    @Param('userId') userId: string,
    @Param('postId', ParseIntPipe) postId: number
  ) {
    const repostedPost = await this.blogPostService.repostPost(postId, userId);
    return fillObject(PostRdo, repostedPost);
  }

  @Post('/')
  async create(@Body() dto: CreatePostDto) {
    const newPost = await this.blogPostService.createPost(dto);
    return fillObject(PostRdo, newPost);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', ParseIntPipe) id: number) {
    this.blogPostService.deletePost(id);
  }

  @Patch('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto
  ) {
    const updatedPost = await this.blogPostService.updatePost(id, dto);
    return fillObject(PostRdo, updatedPost);
  }
}
