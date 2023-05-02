import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { fillObject } from '@project/util/util-core';
import { CommentRdo } from './rdo/comment.rdo';
import { CreateComment } from './dto/create-comment.dto';
import { PostRdo } from '../blog-post/rdo/post.rdo';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService
  ) {}

  @Get('/:id')
  async show(@Param ('id', ParseIntPipe) id: number) {
    const comment = await this.commentService.getComment(id);
    return fillObject(CommentRdo, comment);
  }

  @Post('/')
  async create(@Body() dto:CreateComment) {
    const newComment = await this.commentService.createComment(dto);
    return fillObject(PostRdo, newComment);
  }
}