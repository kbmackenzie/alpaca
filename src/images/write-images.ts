import { AlpacaConfig } from '@/config/alpaca-config';
import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { PostInfo } from '@/post/post-type';
import { tryFindImages } from '@/images/find-images';
import { tryCompressImage } from '@/images/compress-image';
import { imageFolder } from '@/constants';
import { tryCopyFile } from '@/safe/io';
import path from 'node:path';

export type ImageMap = Map<string, string>;

type Writer = (from: string, to: string) => Promise<Either<string, void>>;

function getWriter(config: AlpacaConfig): Writer {
  return (config.preserveImages) ? tryCopyFile : tryCompressImage;
}

export async function writeImages(
  config: AlpacaConfig,
  post: PostInfo,
): Promise<Either<string, ImageMap>> {
  async function copyAll(images: string[]): Promise<Either<string, ImageMap>> {
    const imageMap: ImageMap = new Map();

    let output: Either<string, void> = either.pure(void 0);
    let i = 0;

    for (const image of images) {
      const ext     = (config.preserveImages) ? path.extname(image) : '.jpg';
      const name    = `${post.id}_${i}${ext}`;
      const newPath = path.join(imageFolder, post.id, name);
      imageMap.set(image, newPath);
      output = either.then(
        output,
        await getWriter(config)(image, newPath),
      );
    }
    /* i adore the short-circuiting behavior of the either monad <3 */
    return either.fmap(_ => imageMap, output);
  };
  return either.bindAsync(
    tryFindImages(config, post.folder.absolute),
    copyAll,
  );
}
