import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { readdir, unlink } from 'fs/promises';
import path from 'path';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  @Interval(480_000)
  async handleInterval() {
    this.logger.debug('Called every 8 mins to clear files');
    for (const file of await readdir('./tmp')) {
      unlink(path.join('./tmp', file));
    }
  }
}
