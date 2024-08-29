import { AlpacaConfig } from '@/config/alpaca-config';
import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { PostInfo } from '@/post/post-type';
import { tryFindImages } from '@/images/find-images';
import { tryCopyFile } from '@/safe/io';
import { imageFolder } from '@/constants';
import path from 'node:path';

export type ImageMap = Map<string, string>;

export async function copyImages(
  config: AlpacaConfig,
  pwd: string,
  post: PostInfo,
): Promise<Either<string, ImageMap>> {
  async function copyAll(images: string[]): Promise<Either<string, ImageMap>> {
    const imageMap: ImageMap = new Map();

    let output: Either<string, void> = either.pure(void 0);
    let i = 0;

    for (const image of images) {
      const name    = `${post.id}_${i}.jpg`;
      const newPath = path.join(imageFolder, post.id, name);
      imageMap.set(image, newPath);
      output = either.then(
        output,
        await tryCopyFile(image, newPath),
      );
    }
    /* i adore the short-circuiting behavior of the either monad <3 */
    return either.fmap(_ => imageMap, output);
  };
  return either.bindAsync(
    tryFindImages(config, pwd),
    copyAll,
  );
}
