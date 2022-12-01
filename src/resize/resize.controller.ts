import { Body, Controller, Post } from '@nestjs/common';
import { resizeService } from './resize.service';

@Controller('resize')
export class ResizeController {
  @Post('/base64')
  async Index(@Body() body: { imgData: string }): Promise<Record<string, any>> {
    // console.log(body.imgData);
    const data = await resizeService.resize(
      {
        base64ImageData: body.imgData,
        timestamp: 1000,
      },
      200,
      200,
    );
    return {
      data,
    };
  }
}
