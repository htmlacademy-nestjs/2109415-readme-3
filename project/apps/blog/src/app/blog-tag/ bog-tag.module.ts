import { Module } from '@nestjs/common';
import { BlogTagService } from './blog-tag.service';
import { BlogTagRepository } from './blog-tag.repository';
import { BlogTagController } from './blog-tag.controller';

@Module({
  imports: [],
  controllers: [BlogTagController],
  providers: [BlogTagService, BlogTagRepository],
  exports: [BlogTagRepository],
})
export class BlogTagModule {}
