import { HttpService } from '@nestjs/axios';
import { ApplicationServiceURL } from './app.config';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { HttpException, HttpStatus, UseFilters } from '@nestjs/common';
import { PostEntity } from '@project/shared/app-types';
import { UpdateOldPostDto } from './dto/update-old-post.dto';

@UseFilters(AxiosExceptionFilter)
export class BlogService {
  constructor(private readonly httpService: HttpService) {}

  public async findPostByText(text: string): Promise<PostEntity[]> {
    if (text !== '') {
      const { data } = await this.httpService.axiosRef.post(
        `${ApplicationServiceURL.Blog}/findbytext?searchingText=${text}`
      );
      return data;
    } else {
      throw new HttpException('Bad_Request', HttpStatus.BAD_REQUEST);
    }
  }

  public async updatePost(
    userId: string,
    dto: UpdateOldPostDto,
    postId: string
  ): Promise<PostEntity> {
    if (userId === dto.userId) {
      console.log();
      const { data } = await this.httpService.axiosRef.patch(
        `${ApplicationServiceURL.Blog}/${postId}`,
        dto
      );
      return data;
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  public async deletePost(
    userIdFomPost: string,
    userId: string,
    postId: string
  ) {
    if (userId === userIdFomPost) {
      await this.httpService.axiosRef.post(
        `${ApplicationServiceURL.Users}/delpost/${userId}`
      );
      await this.httpService.axiosRef.delete(
        `${ApplicationServiceURL.Blog}/${postId}`
      );
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  public async deleteComment(
    userIdFromComment: string,
    userId: string,
    commentId: number
  ) {
    if (userId === userIdFromComment) {
      await this.httpService.axiosRef.delete(
        `${ApplicationServiceURL.Comments}/${commentId}`
      );
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
