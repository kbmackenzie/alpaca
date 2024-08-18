import { Either, left, right } from '@/monad/either';
import matter, { GrayMatterFile } from 'gray-matter';

export type MatterData = GrayMatterFile<Buffer>;

export function yamlMatter(path: string, content: Buffer): Either<string, MatterData> {
  try {
    const data = matter(content, { language: 'yaml' });
    return right(data);
  }
  catch (error) {
    return left(`Couldn't parse front matter in file "${path}": ${String(error)}`);
  }
}
