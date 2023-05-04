import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { fillObject } from '@project/util/util-core';
import { PostRdo } from './rdo/post.rdo';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostQuery } from './query/post.query';

@Controller('posts')
export class BlogPostController {
  constructor(
    private readonly blogPostService: BlogPostService
  ) {}

  @Get('/:id')
  async show(@Param('id', ParseIntPipe) id: number) {
    const post = await this.blogPostService.getPost(id);
    console.log(post, post.tags.length);
    return {...fillObject(PostRdo, post), commentsLength: post.comments.length, favoriteLength: post.favorite.length};
  }

  @Get('/')
  async index(@Query() query:PostQuery) {
    const posts = await this.blogPostService.getPosts(query);
    return fillObject(PostRdo, posts);
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
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePostDto) {
    const updatedPost = await this.blogPostService.updatePost(id, dto);
    return fillObject(PostRdo, updatedPost)
  }
}
