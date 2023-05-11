import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { fillObject } from '@project/util/util-core';
import { CommentRdo } from './rdo/comment.rdo';
import { CreateComment } from './dto/create-comment.dto';
import { CommentQuery } from './query/comment.query';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/:postId')
  public async show(@Param('postId') postId, @Query() query: CommentQuery) {
    const comments = [
      ...(await this.commentService.getComments(query, postId)),
    ];
    return comments.map((comment) => fillObject(CommentRdo, comment));
  }
  @Post('/')
  async create(@Body() dto: CreateComment) {
    const newComment = await this.commentService.createComment(dto);
    return fillObject(CommentRdo, newComment);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.commentService.deleteComment(id);
  }
}
