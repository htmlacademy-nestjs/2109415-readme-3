import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BlogTagService } from './blog-tag.service';
import { TagQuery } from './query/tag.query';
import { fillObject } from '@project/util/util-core';
import { TagRdo } from './rdo/tag.rdo';
import { CreateTagDto } from './dto/create-tag.dto';

@Controller('tags')
export class BlogTagController {
  constructor(private readonly blogTagService: BlogTagService) {}

  @Get('/')
  async show(@Query() query: TagQuery) {
    const tag = await this.blogTagService.checkTagExisting(
      query.tag.toLowerCase()
    );
    return fillObject(TagRdo, tag);
  }

  @Post('/')
  async create(@Body() dto: CreateTagDto) {
    dto.text = dto.text.toLowerCase();
    const existingTag = await this.blogTagService.checkTagExisting(dto.text);
    if (!existingTag && !isFinite(Number(dto.text[0]))) {
      const newTag = await this.blogTagService.createTag(dto);
      return fillObject(TagRdo, newTag);
    }
  }
}
