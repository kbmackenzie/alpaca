import { AlpacaConfig } from '@/config/alpaca-config';
import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { tryFindImages } from '@/images/find-images';
import { tryCopyFile } from '@/safe/io';

export async function copyImages(
  config: AlpacaConfig,
  from: string,
  to: string
): Promise<Either<string, string[]>> {
  return either.bindAsync(
    tryFindImages(config, from),
    async (images) => {
      let errorList: string[] = [];

      for (const image of images) {
        const result = await tryCopyFile(image, to);
        if (either.isLeft(result)) {
          errorList.push(result.value);
        }
      }
      return either.right<string, string[]>(errorList);
    },
  );
}
