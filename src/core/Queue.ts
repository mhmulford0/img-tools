import * as dotenv from 'dotenv';
dotenv.config();

import { Job, Queue, Worker } from 'bullmq';
import sharp from 'sharp';

// TODO: switch back to DO for redis.
// ? reminder to update TLS option for
// ? connectionOpts, redis: {tls: {} },

const connectionOpts = {
  host: 'containers-us-west-133.railway.app',
  username: 'default',
  password: process.env.REDIS_PASSWORD,
  port: 6315,
};

class ImageQueue {
  public queue = new Queue('resize-img', {
    connection: connectionOpts,
  });

  public worker() {
    return new Worker(
      'resize-img',
      async (job: Job) => {
        try {
          const imgBuffer = Buffer.from(job.data.imgData.data, 'utf-8');
          await sharp(imgBuffer)
            .resize({ width: job.data.width, height: job.data.height })
            .toFile(`tmp/${job.data.tmpName}.${job.data.mimeType}`);
        } catch (error) {
          console.error(error);
        }
      },
      {
        connection: connectionOpts,
      },
    );
  }
}

export const imageQueue = new ImageQueue();
