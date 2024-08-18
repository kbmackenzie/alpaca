import { Either, left, right } from '@/monad/either';
import { resolve } from 'node:path';

const imageAlias = /^\@kestrel\/(.*)$/;

export function transformImagePath(input: string, imageRoot: string): Either<string, string> {
  const pathMatch = imageAlias.exec(input);
  if (pathMatch === null) {
    return left(`Couldn't parse image path: "${input}"`);
  }
  return right(resolve(imageRoot, pathMatch[1]));
}

export function shouldTransform(input: string): boolean {
  return imageAlias.test(input);
}
