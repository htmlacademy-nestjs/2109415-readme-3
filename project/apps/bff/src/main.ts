import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { RequestIdInterceptor } from './app/interceptors/request-id.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('The «BFF» service')
    .setDescription('BFF service API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const port = process.env.PORT || 4000;
  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);

  app.useGlobalInterceptors(new RequestIdInterceptor());
  SwaggerModule.setup('spec', app, document);
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
