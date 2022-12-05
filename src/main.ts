import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';
import { imageQueue } from './core/Queue';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '4mb' }));
  app.use(urlencoded({ extended: true, limit: '4mb' }));

  imageQueue.worker();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
