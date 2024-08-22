import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { globby, Options } from 'globby';

export async function tryGlob(
  folder: string,
  globOptions?: Options,
): Promise<Either<string, string[]>> {
  try {
    const images = await globby(folder, globOptions);
    return either.right<string, string[]>(images);
  }
  catch (error) {
    return either.left<string, string[]>(`Couldn't glob in folder "${folder}": ${String(error)}`);
  }
}
