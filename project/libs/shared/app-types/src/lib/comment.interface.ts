export interface Comment {
  commentId?: number;
  message: string;
  userId: string;
  postId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
