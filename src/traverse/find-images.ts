import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { KestrelConfig, defaultImageExtensions } from '@/config/kestrel-config';
import { tryGlob } from '@/safe/glob';
import { tryCopyFile } from '@/safe/io';

export async function globImages(
  config: KestrelConfig,
  folder: string
): Promise<Either<string, string[]>> {
  return tryGlob(folder, {
    expandDirectories: {
      extensions: config.imageExtensions ?? defaultImageExtensions,
    },
  });
}

export async function copyImages(
  config: KestrelConfig,
  from: string,
  to: string
): Promise<Either<string, string[]>> {
  const imagePaths = await globImages(config, from);
  if (either.isLeft(imagePaths)) return imagePaths;

  /* Store error messages; continue even after one copy fails. */
  const errorList: string[] = [];

  for (const image of imagePaths.value) {
    const result = await tryCopyFile(image, to);
    if (either.isLeft(result)) { errorList.push(result.value); }
  }
  return either.right<string, string[]>(errorList);
}
