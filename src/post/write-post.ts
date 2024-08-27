import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { AlpacaConfig } from '@/config/alpaca-config';
import { getPostDate } from '@/post/post-date';
import { BlogPost, PostMetadata, PostFile, PostInfo } from '@/post/post-type';
import { readPost } from '@/post/read-post';
import { resolveImageAlias } from '@/images/resolve-alias';
import { remark } from 'remark';
import path from 'node:path';

export async function compilePost(
  config: AlpacaConfig,
  info: PostInfo,
): Promise<Either<string, BlogPost>> {
  return await either.bindAsync(
    readPost(info.path.absolute),
    (postData) => createPost(config, info, postData)
  );
}

export async function createPost(
  config: AlpacaConfig,
  info: PostInfo,
  postData: PostFile
): Promise<Either<string, BlogPost>> {
  const metaM = await either.bindAsync(
    getPostDate(config, info.path.absolute, postData.date),
    async (date) => either.right<string, PostMetadata>({
      title: postData.title,
      id: info.id,
      timestamp: date.getTime(),
      description: postData.description ?? '',
      tags: postData.tags ?? [],
    })
  );
  const bodyM = await transformContent(config, info.id, postData.content);
  return either.bind(
    metaM,
    meta => either.bind(
      bodyM,
      body => either.right<string, BlogPost>({
        metadata: meta,
        body: body,
      })
    )
  );
}

export async function transformContent(
  config: AlpacaConfig,
  id: string,
  content: string,
): Promise<Either<string, string>> {
  if (!config.imageAlias) {
    return either.right(content);
  }
  const rem = remark().use(resolveImageAlias, {
    imageRoot: path.join(config.imageAlias, id),
  });
  const file = await rem.process(content);
  return either.right(String(file));
}
