import { PostFile, validatePostMeta } from '@/post/post-type';
import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { tryReadFile } from '@/safe/io';
import { MatterData, yamlMatter } from '@/safe/matter';

export async function readPost(post: string) {
  return either.bind(
    await tryReadFile(post),
    buffer => either.bind(
      yamlMatter(post, buffer.toString()),
      matter => getPostData(post, matter)
    )
  );
}

function getPostData(post: string, { data, rest }: MatterData): Either<string, PostFile> {
  if (data.type === 'nothing') return either.left(
    `Post file "${post}" does not contain front matter!`
  );
  return either.bind(
    validatePostMeta(data.value),
    meta => either.right<string, PostFile>({
      ...meta,
      content: rest,
    })
  );
}
