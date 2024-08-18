import { Either, left, right } from '@/monad/either';
import matter, { GrayMatterFile } from 'gray-matter';

type MatterData = GrayMatterFile<Buffer>;

export function tryMatter(path: string, content: Buffer): Either<string, MatterData> {
  try {
    const data = matter(content);
    return right(data);
  }
  catch (error) {
    return left(`Couldn't parse front matter in file "${path}": ${String(error)}`);
  }
}
