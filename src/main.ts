import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';
import { Job, Queue, Worker } from 'bullmq';
import { join } from 'path';
import sharp from 'sharp';
import { createReadStream } from 'fs';

export const queue = new Queue('resize-img');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '4mb' }));
  app.use(urlencoded({ extended: true, limit: '4mb' }));

  new Worker('resize-img', async (job: Job) => {
    console.log(job.data);
    try {
      const imgBuffer = Buffer.from(job.data.imgData.data, 'utf-8');
      await sharp(imgBuffer)
        .resize({ width: job.data.width, height: job.data.height })
        .toFile(`tmp/${job.data.tmpName}.${job.data.mimeType}`);

      const fileStream = createReadStream(
        join(process.cwd(), `tmp/${job.data.tmpName}.${job.data.mimeType}`),
      );

      return fileStream;
    } catch (error) {
      console.error(error);
    }
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
