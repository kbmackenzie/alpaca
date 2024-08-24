import { Either } from '@/monad/either';
import * as either from '@/monad/either';

export function tryParseJson(content: string): Either<string, any> {
  try {
    const data = JSON.parse(content);
    return either.right(data);
  }
  catch (error) {
    return either.left(`Couldn't parse JSON: ${String(error)}`);
  }
}
