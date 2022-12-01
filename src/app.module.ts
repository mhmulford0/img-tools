import { Module } from '@nestjs/common';
import { ResizeModule } from './resize/resize.module';

@Module({
  imports: [ResizeModule],
})
export class AppModule {}
