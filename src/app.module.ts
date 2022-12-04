import { Module } from '@nestjs/common';

import { ResizeModule } from './resize/resize.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsModule } from './jobs/jobs.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ResizeModule,
    ScheduleModule.forRoot(),
    JobsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'tmp'),
    }),
  ],
})
export class AppModule {}
