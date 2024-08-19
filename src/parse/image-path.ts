import { Either, left, right } from '@/monad/either';

const imageAlias = /^\@kestrel\/(.*)$/;

/* Always returns a *relative path* if successful! */
export function transformImagePath(input: string): Either<string, string> {
  const pathMatch = imageAlias.exec(input);
  if (pathMatch === null) {
    return left(`Couldn't parse image path: "${input}"`);
  }
  return right(pathMatch[1]);
}

export function shouldTransform(input: string): boolean {
  return imageAlias.test(input);
}
