import sharp from 'sharp';
import { createReadStream, ReadStream } from 'fs';
import { join } from 'path';

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
  ): Promise<ReadStream> | TypeError;
}

class ResizeService implements Resizer {
  async base64(data: Base64Data, width: number, height: number) {
    const imgBuffer = Buffer.from(data.base64ImageData, 'base64');
    try {
      const resized = await sharp(imgBuffer)
        .resize({ width, height })
        .toBuffer();
      return resized.toString('base64');
    } catch (error) {
      console.log(error);
      throw TypeError('Incorrect data');
    }
  }
  async file(data: Express.Multer.File, width: number, height: number) {
    const tmpName = Date.now().toString();
    await sharp(data.buffer)
      .resize({ width, height })
      .toFile(`tmp/${tmpName}.png`);

    const fileStream = createReadStream(
      join(process.cwd(), `tmp/${tmpName}.png`),
    );

    return fileStream;
  }
}

export const resizeService = new ResizeService();
