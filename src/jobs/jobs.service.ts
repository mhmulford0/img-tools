import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { readdir, unlink } from 'fs/promises';
import { Job, Worker } from 'bullmq';
import path, { join } from 'path';
import sharp from 'sharp';
import { createReadStream } from 'fs';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  // @Interval(480_000)
  @Interval(120_000)
  async handleInterval() {
    this.logger.log('Called every 8 mins to clear files');
    for (const file of await readdir('./tmp')) {
      unlink(path.join('./tmp', file));
    }
  }

  @Interval(10_000)
  processQueue() {
    new Worker(
      'resize-img',
      async (job: Job) => {
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
      },
      { concurrency: 2 },
    );
  }
}
