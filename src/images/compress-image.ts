import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import sharp, { JpegOptions } from 'sharp';

const jpegOptions: JpegOptions = {
  quality: 85,
  optimiseCoding: true, 
  mozjpeg: true,
};

export async function compressImage(input: string, output: string): Promise<void> {
  await sharp(input).jpeg(jpegOptions).toFile(output);
}

export async function tryCompressImage(input: string, output: string): Promise<Either<string, void>> {
  try {
    await compressImage(input, output);
    return either.right<string, void>(void 0);
  }
  catch (error) {
    return either.left<string, void>(
      `Couldn't compress image "${input}": ${String(error)}`
    );
  }
}
