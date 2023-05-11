import { Injectable } from '@nestjs/common';
import { CRUDRepository } from '@project/util/util-types';
import { BlogPostEntity } from './blog-post.entity';
import { PostEntity } from '@project/shared/app-types';
import { PrismaService } from '../prisma/prisma.service';
import { PostQuery } from './query/post.query';
import {
  DEFAULT_FILLTERED_BY_NAME_POST_COUNT_LIMIT,
  DEFAULT_FILLTERED_BY_TAGS_POST_COUNT_LIMIT,
} from './blog-post.constant';

@Injectable()
export class BlogPostRepository
  implements CRUDRepository<BlogPostEntity, number, PostEntity>
{
  constructor(private readonly prisma: PrismaService) {}

  public async create(item: BlogPostEntity): Promise<PostEntity> {
    const entityData = item.toObject();
    return this.prisma.postEntity.create({
      data: {
        ...entityData,
        tags: {
          connect: entityData.tags.map(({ tagId }) => ({ tagId })),
        },
        videoPost: {
          create: item.videoPost,
        },
        textPost: {
          create: item.textPost,
        },
        quotePost: {
          create: item.quotePost,
        },
        picturePost: {
          create: item.picturePost,
        },
        linkPost: {
          create: item.linkPost,
        },
        comments: {
          connect: [],
        },
        favorite: {
          connect: [],
        },
      },
      include: {
        videoPost: true,
        textPost: true,
        quotePost: true,
        picturePost: true,
        linkPost: true,
        comments: true,
        favorite: true,
        tags: true,
      },
    });
  }

  public async destroy(postId: number): Promise<void> {
    await this.prisma.postEntity.delete({
      where: {
        postId,
      },
    });
  }

  public async findById(postId: number): Promise<PostEntity | null> {
    return this.prisma.postEntity.findFirst({
      where: {
        postId,
      },
      include: {
        videoPost: true,
        textPost: true,
        quotePost: true,
        picturePost: true,
        linkPost: true,
        comments: true,
        favorite: true,
        tags: true,
      },
    });
  }

  public find({ limit, sortType, page }: PostQuery): Promise<PostEntity[]> {
    if (sortType === 'byComments') {
      return this.prisma.postEntity.findMany({
        take: limit,
        include: {
          videoPost: true,
          textPost: true,
          quotePost: true,
          picturePost: true,
          linkPost: true,
          comments: true,
          favorite: true,
          tags: true,
        },
        orderBy: {
          comments: {
            _count: 'desc',
          },
        },
        skip: page > 0 ? limit * (page - 1) : undefined,
      });
    }
    if (sortType === 'byRating') {
      return this.prisma.postEntity.findMany({
        take: limit,
        include: {
          videoPost: true,
          textPost: true,
          quotePost: true,
          picturePost: true,
          linkPost: true,
          comments: true,
          favorite: true,
          tags: true,
        },
        orderBy: {
          favorite: {
            _count: 'desc',
          },
        },
        skip: page > 0 ? limit * (page - 1) : undefined,
      });
    }
    return this.prisma.postEntity.findMany({
      take: limit,
      include: {
        comments: true,
        tags: true,
        favorite: true,
      },
      orderBy: [
        {
          publishAt: 'asc',
        },
      ],
      skip: page > 0 ? limit * (page - 1) : undefined,
    });
  }
  public findByUserIds(
    { limit, sortType, page }: PostQuery,
    ids: string[]
  ): Promise<PostEntity[]> {
    if (sortType === 'byComments') {
      return this.prisma.postEntity.findMany({
        where: {
          userId: {
            in: ids,
          },
          isDraft: false,
        },
        take: limit,
        include: {
          videoPost: true,
          textPost: true,
          quotePost: true,
          picturePost: true,
          linkPost: true,
          comments: true,
          favorite: true,
          tags: true,
        },
        orderBy: {
          comments: {
            _count: 'desc',
          },
        },
        skip: page > 0 ? limit * (page - 1) : undefined,
      });
    }
    if (sortType === 'byRating') {
      return this.prisma.postEntity.findMany({
        where: {
          userId: {
            in: ids,
          },
          isDraft: false,
        },
        take: limit,
        include: {
          videoPost: true,
          textPost: true,
          quotePost: true,
          picturePost: true,
          linkPost: true,
          comments: true,
          favorite: true,
          tags: true,
        },
        orderBy: {
          favorite: {
            _count: 'desc',
          },
        },
        skip: page > 0 ? limit * (page - 1) : undefined,
      });
    }
    return this.prisma.postEntity.findMany({
      where: {
        userId: {
          in: ids,
        },
        isDraft: false,
      },
      take: limit,
      include: {
        videoPost: true,
        textPost: true,
        quotePost: true,
        picturePost: true,
        linkPost: true,
        comments: true,
        favorite: true,
        tags: true,
      },
      orderBy: [
        {
          publishAt: 'asc',
        },
      ],
      skip: page > 0 ? limit * (page - 1) : undefined,
    });
  }

  public findByTagText(tagsText: string[]): Promise<PostEntity[]> {
    return this.prisma.postEntity.findMany({
      where: {
        tags: {
          some: {
            text: {
              in: tagsText,
            },
          },
        },
      },
      take: DEFAULT_FILLTERED_BY_TAGS_POST_COUNT_LIMIT,
      include: {
        videoPost: true,
        textPost: true,
        quotePost: true,
        picturePost: true,
        linkPost: true,
        comments: true,
        favorite: true,
        tags: true,
      },
    });
  }

  public findByName(searchingText: string): Promise<PostEntity[]> {
    return this.prisma.postEntity.findMany({
      where: {
        OR: [
          {
            videoPost: {
              title: {
                contains: searchingText,
              },
            },
          },
          {
            textPost: {
              name: {
                contains: searchingText,
              },
            },
          },
        ],
      },
      take: DEFAULT_FILLTERED_BY_NAME_POST_COUNT_LIMIT,
      include: {
        videoPost: true,
        textPost: true,
        quotePost: true,
        picturePost: true,
        linkPost: true,
        comments: true,
        favorite: true,
        tags: true,
      },
    });
  }

  public update(id: number, item: BlogPostEntity): Promise<PostEntity> {
    const entityData = item.toObject();
    return this.prisma.postEntity.update({
      where: {
        postId: id,
      },
      data: {
        ...entityData,
        tags: {
          connect: entityData.tags.map(({ tagId }) => ({ tagId })),
        },
        videoPost:
          item.videoPost != null
            ? {
                update: {
                  title:
                    item.videoPost.title != null
                      ? item.videoPost.title
                      : undefined,
                  linkVideo:
                    item.videoPost.linkVideo != null
                      ? item.videoPost.linkVideo
                      : undefined,
                },
              }
            : undefined,
        textPost:
          item.textPost != null
            ? {
                update: {
                  name:
                    item.textPost.name != null ? item.textPost.name : undefined,
                  announcement:
                    item.textPost.announcement != null
                      ? item.textPost.announcement
                      : undefined,
                  text:
                    item.textPost.text != null ? item.textPost.text : undefined,
                },
              }
            : undefined,
        quotePost:
          item.quotePost != null
            ? {
                update: item.quotePost,
              }
            : undefined,
        picturePost:
          item.picturePost != null
            ? {
                update: item.picturePost,
              }
            : undefined,
        linkPost:
          item.linkPost != null
            ? {
                update: item.linkPost,
              }
            : undefined,
        publishAt: {
          set: new Date(),
        },
        comments: {
          connect: entityData.comments.map(({ commentId }) => ({ commentId })),
        },
        favorite: {
          connect: entityData.favorite.map(({ favoriteId }) => ({
            favoriteId,
          })),
        },
      },
      include: {
        videoPost: true,
        textPost: true,
        quotePost: true,
        picturePost: true,
        linkPost: true,
        comments: true,
        favorite: true,
        tags: true,
      },
    });
  }
}
