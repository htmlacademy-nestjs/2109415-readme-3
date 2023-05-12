import { CRUDRepository } from '@project/util/util-types';
import { CommentEntity } from './ comment.entity';
import { PrismaService } from '../prisma/prisma.service';
import { Comment } from '@project/shared/app-types';
import { Injectable } from '@nestjs/common';
import { CommentQuery } from './query/comment.query';

@Injectable()
export class CommentRepository
  implements CRUDRepository<CommentEntity, number, Comment>
{
  constructor(private readonly prisma: PrismaService) {}

  public async create(item: CommentEntity): Promise<Comment> {
    const entityData = item.toObject();
    return this.prisma.comment.create({
      data: {
        commentId: entityData.commentId,
        message: entityData.message,
        userId: entityData.userId,
        postId: entityData.postId,
        createdAt: entityData.createdAt,
        updatedAt: entityData.updatedAt,
      },
    });
  }

  public async destroy(commentId: number): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        commentId,
      },
    });
  }

  public async findById(commentId: number): Promise<Comment> | null {
    return this.prisma.comment.findFirst({
      where: {
        commentId,
      },
    });
  }

  public async find(
    { limit, page }: CommentQuery,
    postId: number
  ): Promise<Comment[]> | null {
    return this.prisma.comment.findMany({
      where: {
        postId: +postId,
      },
      take: limit,
      skip: page > 0 ? limit * (page - 1) : undefined,
    });
  }
}
