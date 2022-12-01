import { Module } from '@nestjs/common';
import { ResizeController } from './resize.controller';

@Module({
  imports: [],
  controllers: [ResizeController],
  providers: [],
})
export class AppModule {}
