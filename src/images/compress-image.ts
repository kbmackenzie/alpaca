import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import sharp, { JpegOptions } from 'sharp';
import path from 'node:path';

const compressable: Set<string> = new Set(['.png', '.jpg', '.webp']);

export function canCompress(image: string) {
  const ext = path.extname(image);
  return compressable.has(ext);
}

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
