import sharp, { JpegOptions } from 'sharp';

const jpegOptions: JpegOptions = {
  quality: 85,
  optimiseCoding: true, 
  mozjpeg: true,
};

export async function compressImage(input: string, output: string): Promise<void> {
  await sharp(input).jpeg(jpegOptions).toFile(output);
}
