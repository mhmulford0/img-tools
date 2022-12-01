import { Controller, Get } from '@nestjs/common';

@Controller('resize')
export class ResizeController {
  // constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'hello world';
  }
}
