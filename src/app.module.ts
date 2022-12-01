import { Module } from '@nestjs/common';
import { ResizeModule } from './resize/resize.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsModule } from './jobs/jobs.module';
@Module({
  imports: [ResizeModule, ScheduleModule.forRoot(), JobsModule],
})
export class AppModule {}
