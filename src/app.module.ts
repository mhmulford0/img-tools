import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { ResizeModule } from './resize/resize.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    ResizeModule,
    ScheduleModule.forRoot(),
    JobsModule,
    BullModule.forRoot({
      redis: {
        host: '127.0.0.1',
        port: 6379,
      },
    }),
  ],
})
export class AppModule {}
