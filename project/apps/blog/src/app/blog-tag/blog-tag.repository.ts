import { Injectable } from '@nestjs/common';
import { BlogTagEntity } from './blog-tag.entity';
import { CRUDRepository } from '@project/util/util-types';
import { Tag } from '@project/shared/app-types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlogTagRepository
  implements CRUDRepository<BlogTagEntity, number, Tag>
{
  constructor(private readonly pisma: PrismaService) {}

  public async create(item: BlogTagEntity): Promise<Tag> {
    const entityData = item.toObject();
    return this.pisma.tag.create({
      data: {
        tagId: entityData.tagId,
        text: entityData.text,
      },
    });
  }

  public async destroy(tagId: number): Promise<void> {
    await this.pisma.tag.delete({
      where: {
        tagId,
      },
    });
  }

  public async findById(tagId: number): Promise<Tag> | null {
    return this.pisma.tag.findFirst({
      where: {
        tagId,
      },
      include: {
        posts: true,
      },
    });
  }

  public async findByIds(ids: number[] = []): Promise<Tag[]> | null {
    const tags: Tag[] = [];
    if (ids.length) {
      return this.pisma.tag.findMany({
        where: {
          tagId: {
            in: ids.length > 0 ? ids : undefined,
          },
        },
        include: {
          posts: true,
        },
      });
    }
    return tags;
  }
  public async findByTagText(text: string): Promise<Tag> | null {
    return this.pisma.tag.findFirst({
      where: {
        text: {
          contains: text,
        },
      },
      include: {
        posts: true,
      },
    });
  }
}
