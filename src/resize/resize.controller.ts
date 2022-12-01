import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  Header,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { resizeService } from './resize.service';

@Controller('resize')
export class ResizeController {
  @Post('/base64')
  async Base64(
    @Body() body: { imgData: string; width: number; height: number },
  ): Promise<Record<string, any>> {
    // console.log(body.imgData);
    const data = await resizeService.base64(
      {
        base64ImageData: body.imgData,
        timestamp: Date.now(),
      },
      200,
      200,
    );
    return {
      data,
    };
  }

  @Post('/file')
  @Header('Content-Type', 'application/json')
  @Header(
    'Content-Disposition',
    `attachment; filename="${Date.now().toString()}"`,
  )
  @UseInterceptors(FileInterceptor('file'))
  async File(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 4e7 }),
          new FileTypeValidator({ fileType: 'jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const stream = await resizeService.file(file, 100, 100);
    return new StreamableFile(stream);
  }
}
