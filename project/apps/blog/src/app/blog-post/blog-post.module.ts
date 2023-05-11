import { Module } from '@nestjs/common';
import { BlogPostController } from './blog-post.controller';
import { BlogPostRepository } from './blog-post.repository';
import { BlogPostService } from './blog-post.service';
import { BlogTagModule } from '../blog-tag/ bog-tag.module';

@Module({
  imports: [BlogTagModule],
  controllers: [BlogPostController],
  providers: [BlogPostService, BlogPostRepository],
})
export class BlogPostModule {}
