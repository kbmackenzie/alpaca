import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { parse } from 'yaml';

export function tryReadYaml(path: string, content: string): Either<string, any> {
  try {
    const data = parse(content);
    return either.right(data);
  }
  catch (error) {
    return either.left(`Couldn't parse YAML from file "${path}": ${String(error)}`);
  }
}
