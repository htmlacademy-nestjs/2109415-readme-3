import { Expose } from 'class-transformer';

export class CommentRdo {
  @Expose()
  public id: number;

  @Expose()
  public message: string;

  @Expose()
  public userId: string;

  @Expose()
  public postId: number;

  @Expose()
  public createAt: Date;

  @Expose()
  public updateAt: Date;
}
