import { Either } from '@/monad/either';
import { Maybe } from '@/monad/maybe';
import * as either from '@/monad/either';
import * as maybe from '@/monad/maybe';
import matter from 'gray-matter';

export type MatterData = {
  data: Maybe<Record<string, any>>;
  rest: string;
};

export function yamlMatter(path: string, content: string): Either<string, MatterData> {
  try {
    if (!matter.test(content)) return either.right({
      data: maybe.nothing,
      rest: content,
    });
    const data = matter(content, { language: 'yaml' });
    return either.right({
      data: maybe.just(data.data),
      rest: data.content,
    });
  }
  catch (error) {
    return either.left(`Couldn't parse front matter in file "${path}": ${String(error)}`);
  }
}
