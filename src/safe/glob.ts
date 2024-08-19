import { Either, left, right } from '@/monad/either';
import { globby, Options } from 'globby';

export async function tryGlob(
  folder: string,
  globOptions?: Options,
): Promise<Either<string, string[]>> {
  try {
    const images = await globby(folder, globOptions);
    return right<string, string[]>(images);
  }
  catch (error) {
    return left<string, string[]>(`Couldn't glob in folder "${folder}": ${String(error)}`);
  }
}
