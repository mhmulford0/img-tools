import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';
import { Job, Queue, Worker } from 'bullmq';
import { join } from 'path';
import sharp from 'sharp';
import { createReadStream } from 'fs';

export const queue = new Queue('resize-img', {
  connection: {
    host: '0.0.0.0',
    port: 6379,
  },
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '4mb' }));
  app.use(urlencoded({ extended: true, limit: '4mb' }));

  new Worker(
    'resize-img',
    async (job: Job) => {
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
    },
    {
      connection: {
        host: '0.0.0.0',
        port: 6379,
      },
    },
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
