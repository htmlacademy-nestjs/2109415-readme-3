import { Comment } from '@project/shared/app-types';
import { Entity } from '@project/util/util-types';

export class CommentEntity implements Entity<Comment> {
  public commentId: number;
  public message: string;
  public userId: string;
  public postId: number;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(comment: Comment) {
    this.fillEntity(comment);
  }
  public fillEntity(entity: Comment): void {
    this.message = entity.message;
    this.userId = entity.userId;
    this.postId = entity.postId;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public toObject(): Comment {
    return { ...this };
  }
}
