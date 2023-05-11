import { Injectable } from '@nestjs/common';
import { BlogTagRepository } from './blog-tag.repository';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from '@project/shared/app-types';
import { BlogTagEntity } from './blog-tag.entity';
import { BLOG_TAG_LENGTH } from './blog-tag.constant';

@Injectable()
export class BlogTagService {
  constructor(private readonly blogTagRepository: BlogTagRepository) {}

  async createTag(dto: CreateTagDto): Promise<Tag> {
    const tagEntity = new BlogTagEntity(dto);
    return this.blogTagRepository.create(tagEntity);
  }

  async checkTagExisting(text: string): Promise<Tag> | null {
    if (
      text.length >= BLOG_TAG_LENGTH.MIN &&
      text.length <= BLOG_TAG_LENGTH.MAX &&
      !text.includes(' ')
    ) {
      return this.blogTagRepository.findByTagText(text);
    }
  }
}
