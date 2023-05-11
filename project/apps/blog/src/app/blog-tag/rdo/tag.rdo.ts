import { PostEntity } from '@project/shared/app-types';
import { Expose } from 'class-transformer';

export class TagRdo {
  @Expose()
  tagId: string;

  @Expose()
  text: string;

  @Expose()
  posts: PostEntity[];
}
