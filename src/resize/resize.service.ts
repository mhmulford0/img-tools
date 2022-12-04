import sharp from 'sharp';
import { createReadStream, ReadStream } from 'fs';
import { join } from 'path';
import { BadRequestException } from '@nestjs/common';

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
  ): Promise<ReadStream> | TypeError;
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
      await sharp(data.buffer)
        .resize({ width, height })
        .toFile(`tmp/${tmpName}.${mimeType}`);

      const fileStream = createReadStream(
        join(process.cwd(), `tmp/${tmpName}.${mimeType}`),
      );

      return fileStream;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('width and height are required');
    }
  }
}

export const resizeService = new ResizeService();
