import { Either, left, right } from '@/monad/either';
import { Maybe, just, nothing } from '@/monad/maybe';
import matter from 'gray-matter';

export type MatterData = {
  data: Maybe<Record<string, any>>;
  rest: string;
};

export function yamlMatter(path: string, content: string): Either<string, MatterData> {
  try {
    if (!matter.test(content)) return right({
      data: nothing,
      rest: content,
    });
    const data = matter(content, { language: 'yaml' });
    return right({
      data: just(data.data),
      rest: data.content,
    });
  }
  catch (error) {
    return left(`Couldn't parse front matter in file "${path}": ${String(error)}`);
  }
}
