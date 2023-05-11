import { Tag } from '@project/shared/app-types';
import { Entity } from '@project/util/util-types';

export class BlogTagEntity implements Entity<BlogTagEntity>, Tag {
  public tagId: number;
  public text: string;

  constructor(tag: Tag) {
    this.fillEntity(tag);
  }

  public fillEntity(entity: Tag) {
    this.text = entity.text;
    this.tagId = entity.tagId;
  }

  public toObject(): BlogTagEntity {
    return { ...this };
  }
}
