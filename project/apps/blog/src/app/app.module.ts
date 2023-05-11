import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { BlogPostModule } from './blog-post/blog-post.module';
import { CommentModule } from './comment/comment.module';
import { BlogTagModule } from './blog-tag/ bog-tag.module';

@Module({
  imports: [PrismaModule, BlogPostModule, CommentModule, BlogTagModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
