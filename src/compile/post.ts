import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { AlpacaConfig } from '@/config/alpaca-config';
import { getPostDate } from '@/parse/date';
import { toPostID } from '@/post/id';
import { Post, PostMetadata } from '@/post/post';
import { PostInfo } from '@/traverse/find-posts';
import { PostData, readPostData } from '@/traverse/read-post';
import { resolveImageAlias } from '@/markdown/image-alias';
import { remark } from 'remark';
import path from 'node:path';

export async function compilePost(
  config: AlpacaConfig,
  info: PostInfo,
): Promise<Either<string, string>> {
  const postM = await either.bindAsync(
    readPostData(info.path),
    (postData) => createPost(config, info, postData)
  );
  return either.fmap(post => JSON.stringify(post), postM);
}

export async function createPost(
  config: AlpacaConfig,
  info: PostInfo,
  postData: PostData,
): Promise<Either<string, Post>> {
  const id = toPostID(info.relative);
  const metaM = await either.bindAsync(
    getPostDate(config, info.path, postData.date),
    async (date) => either.right<string, PostMetadata>({
      title: postData.title,
      id: id,
      timestamp: date.getTime(),
      description: postData.description ?? '',
      tags: postData.tags ?? [],
    })
  );
  const bodyM = await transformContent(config, id, postData.content);
  return either.bind(metaM, meta => either.bind(bodyM, body => either.right<string, Post>({
    metadata: meta,
    body: body,
  })));
}

export async function transformContent(
  config: AlpacaConfig,
  id: string,
  content: string,
): Promise<Either<string, string>> {
  if (!config.images?.imageRoot) {
    return either.right(content);
  }
  const rem = remark().use(resolveImageAlias, {
    imageRoot: path.join(config.images.imageRoot, id),
  });
  const file = await rem.process(content);
  return either.right(String(file));
}
