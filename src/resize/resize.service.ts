import sharp from 'sharp';
import { BadRequestException } from '@nestjs/common';
import { imageQueue } from 'src/core/Queue';


type Base64Data = {
  timestamp: number;
  base64ImageData: string;
};

interface Resizer {
  base64(
    data: Base64Data,
    width: number,
    height: number,
  ): Promise<string> | TypeError;
  file(
    data: Express.Multer.File,
    width: number,
    height: number,
    mimeType: string,
  ): Promise<Record<string, string>> | TypeError;
}

class ResizeService implements Resizer {
  async base64(data: Base64Data, width: number, height: number) {
    const imgBuffer = Buffer.from(data.base64ImageData, 'base64');

    try {
      const resized = await sharp(imgBuffer)
        .resize({
          width,
          height,
        })
        .toBuffer();
      return resized.toString('base64');
    } catch (error) {
      console.log(error);
      throw TypeError('Incorrect data');
    }
  }
  async file(
    data: Express.Multer.File,
    width: number,
    height: number,
    mimeType: string,
  ) {
    const tmpName = Date.now().toString();

    try {
      imageQueue.queue.add('resize-img', {
        imgData: data.buffer,
        width,
        height,
        mimeType,
        tmpName,
      });

      return {
        message: 'added to queue',
        file: `${tmpName}.${mimeType}`,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('width and height are required');
    }
  }
}

export const resizeService = new ResizeService();
