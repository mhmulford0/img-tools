import * as core from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { resizeService } from './resize.service';


@core.Controller('resize')
export class ResizeController {
  @core.Post('/base64')
  async Base64(
    @core.Body() body: { imgData: string; width: number; height: number },
  ): Promise<{ data: string }> {
    try {
      const data = await resizeService.base64(
        {
          base64ImageData: body.imgData,
          timestamp: Date.now(),
        },
        body.width,
        body.height,
      );
      return { data };
    } catch (error) {
      throw new core.InternalServerErrorException(
        'Could not complete request: generic error',
      );
    }
  }

  @core.Post('/file')
  @core.UseInterceptors(FileInterceptor('file'))
  @core.Header(
    'Content-Disposition',
    `attachment; filename="${Date.now().toString()}"`,
  )
  async File(
    @core.Query('width') width: string,
    @core.Query('height') height: string,
    @core.UploadedFile(
      new core.ParseFilePipe({
        validators: [
          new core.MaxFileSizeValidator({ maxSize: 4e7 }),
          new core.FileTypeValidator({
            fileType: RegExp(/(jpg|jpeg|png)/g),
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (typeof width === undefined || typeof height === undefined) {
      throw new core.NotAcceptableException('Width and height required');
    }

    try {
      const mimeType = file.mimetype.split('/')[1];
      const data = await resizeService.file(
        file,
        parseInt(width),
        parseInt(height),
        mimeType,
      );
      return 'added';
    } catch (error) {
      console.log(error);
      throw new core.InternalServerErrorException(
        'Could not complete request: generic error',
      );
    }
  }
}
