import { Either, left, right } from '@/monad/either';
import { parse } from 'yaml';

export function readYaml(path: string, content: string): Either<string, any> {
  try {
    const data = parse(content);
    return right(data);
  }
  catch (error) {
    return left(`Couldn't parse YAML from file "${path}": ${String(error)}`);
  }
}
