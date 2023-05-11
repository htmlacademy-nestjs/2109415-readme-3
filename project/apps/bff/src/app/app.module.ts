import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { UsersController } from './users.controller';
import { HTTP_CLIENT_MAX_REDIRECTS, HTTP_CLIENT_TIMEOUT } from './app.config';
import { HttpModule } from '@nestjs/axios';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { BlogService } from './blog.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: HTTP_CLIENT_TIMEOUT,
      maxRedirects: HTTP_CLIENT_MAX_REDIRECTS,
    }),
  ],
  controllers: [UsersController, BlogController],
  providers: [CheckAuthGuard, BlogService],
})
export class AppModule {}
