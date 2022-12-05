import * as common from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { resizeService } from './resize.service';


@common.Controller('resize')
export class ResizeController {
  @common.Post('/base64')
  async Base64(
    @common.Body() body: { imgData: string; width: number; height: number },
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
      throw new common.InternalServerErrorException(
        'Could not complete request: generic error',
      );
    }
  }

  @common.Post('/file')
  @common.UseInterceptors(FileInterceptor('file'))
  async File(
    @common.Query('width') width: string,
    @common.Query('height') height: string,
    @common.UploadedFile(
      new common.ParseFilePipe({
        validators: [
          new common.MaxFileSizeValidator({ maxSize: 4e7 }),
          new common.FileTypeValidator({
            fileType: RegExp(/(jpg|jpeg|png)/g),
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (typeof width === undefined || typeof height === undefined) {
      throw new common.NotAcceptableException('Width and height required');
    }

    try {
      const mimeType = file.mimetype.split('/')[1];
      const data = await resizeService.file(
        file,
        parseInt(width),
        parseInt(height),
        mimeType,
      );
      return data;
    } catch (error) {
      console.log(error);
      throw new common.InternalServerErrorException(
        'Could not complete request: generic error',
      );
    }
  }
}
