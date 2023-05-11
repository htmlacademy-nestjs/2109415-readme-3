import { Module } from '@nestjs/common';
import { BlogUserModel, BlogUserSchema } from './blog-user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogUserRepository } from './blog-user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlogUserModel.name, schema: BlogUserSchema },
    ]),
  ],
  providers: [BlogUserRepository],
  exports: [BlogUserRepository],
})
export class BlogUserModule {}
