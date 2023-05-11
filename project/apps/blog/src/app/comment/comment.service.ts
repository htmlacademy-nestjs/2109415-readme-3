import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { CreateComment } from './dto/create-comment.dto';
import { Comment } from '@project/shared/app-types';
import { CommentEntity } from './ comment.entity';
import { CommentQuery } from './query/comment.query';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  public async createComment(dto: CreateComment): Promise<Comment> {
    const commentEntity = new CommentEntity({ ...dto });
    return this.commentRepository.create(commentEntity);
  }

  public async deleteComment(id: number): Promise<void> {
    this.commentRepository.destroy(id);
  }

  public async getComment(id: number): Promise<Comment> {
    return this.commentRepository.findById(id);
  }

  public async getComments(
    query: CommentQuery,
    postId: number
  ): Promise<Comment[]> | null {
    return this.commentRepository.find(query, postId);
  }
}
