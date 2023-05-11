import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from '@project/shared/app-types';
import { UpdatePostDto } from './dto/update-post.dto';
import { BlogPostEntity } from './blog-post.entity';
import { BlogPostRepository } from './blog-post.repository';
import { PostQuery } from './query/post.query';
import { BlogTagRepository } from '../blog-tag/blog-tag.repository';

@Injectable()
export class BlogPostService {
  constructor(
    private readonly blogPostRepository: BlogPostRepository,
    private readonly blogTagRepository: BlogTagRepository
  ) {}

  public async createPost(dto: CreatePostDto): Promise<PostEntity> {
    const tagsSet = new Set(dto.tags);
    const tags = await this.blogTagRepository.findByIds(Array.from(tagsSet));
    const postEntity = new BlogPostEntity({
      ...dto,
      tags,
      isDraft: false,
      comments: [],
      favorite: [],
    });
    return this.blogPostRepository.create(postEntity);
  }

  public async deletePost(id: number): Promise<void> {
    this.blogPostRepository.destroy(id);
  }

  public async getPost(id: number): Promise<PostEntity> {
    return this.blogPostRepository.findById(id);
  }

  public async getPosts(query: PostQuery): Promise<PostEntity[]> {
    return this.blogPostRepository.find(query);
  }

  public async getMyFeedPosts(
    query: PostQuery,
    ids: string[]
  ): Promise<PostEntity[]> {
    return this.blogPostRepository.findByUserIds(query, ids);
  }

  public async updatePost(id: number, dto: UpdatePostDto): Promise<PostEntity> {
    const tagsSet = new Set(dto.tags);
    const tags = await this.blogTagRepository.findByIds(Array.from(tagsSet));
    const oldPost = await this.blogPostRepository.findById(id);
    const postEntity = new BlogPostEntity({
      ...oldPost,
      ...dto,
      tags,
      isDraft: false,
    });
    postEntity.createdAt = oldPost.createdAt;
    return this.blogPostRepository.update(id, postEntity);
  }

  public async repostPost(
    originalPostId: number,
    newOnerId: string
  ): Promise<PostEntity> {
    const originalPost = await this.blogPostRepository.findById(originalPostId);
    for (const key in originalPost) {
      if (!originalPost[key]) {
        delete originalPost[key];
      } else {
        delete originalPost[key].postId;
        delete originalPost[key].id;
        delete originalPost[key].post;
      }
    }
    const postEntity = new BlogPostEntity({
      ...originalPost,
      comments: [],
      favorite: [],
      originalPostId: originalPostId,
      userId: newOnerId,
    });
    return this.blogPostRepository.create(postEntity);
  }

  public async getPostsByTags(tagsText: string[]): Promise<PostEntity[]> {
    return this.blogPostRepository.findByTagText(tagsText);
  }

  public async getPostByName(searchingText: string): Promise<PostEntity[]> {
    return this.blogPostRepository.findByName(searchingText);
  }
}
