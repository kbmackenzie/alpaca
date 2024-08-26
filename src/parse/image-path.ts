import { Either } from '@/monad/either';
import * as either from '@/monad/either';

const imageAlias = /^\@alpaca\/(.*)$/;

/* Always returns a *relative path* if successful! */
export function parseImagePath(input: string): Either<string, string> {
  const pathMatch = imageAlias.exec(input);
  if (pathMatch === null) {
    return either.left(`Couldn't parse image path: "${input}"`);
  }
  return either.right(pathMatch[1]);
}

export function shouldTransform(input: string): boolean {
  return imageAlias.test(input);
}
