import { Module } from '@nestjs/common';
import { ResizeController } from './resize.controller';

@Module({
  controllers: [ResizeController],
})
export class ResizeModule {}
