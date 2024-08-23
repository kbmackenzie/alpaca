import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { KestrelConfig } from '@/config/kestrel-config';
import { getPostDate } from '@/parse/date';
import { toPostID } from '@/post/id';
import { Post, PostMetadata } from '@/post/post';
import { PostInfo } from '@/traverse/find-posts';
import { PostData, readPostData } from '@/traverse/read-post';
import { resolveImageAlias } from '@/markdown/image-alias';
import { remark } from 'remark';

export async function compilePost(
  config: KestrelConfig,
  info: PostInfo,
): Promise<Either<string, string>> {
  const postM = await either.bindAsync(
    readPostData(info.path),
    (postData) => createPost(config, info, postData)
  );
  return either.fmap(post => JSON.stringify(post), postM);
}

export async function createPost(
  config: KestrelConfig,
  info: PostInfo,
  postData: PostData,
): Promise<Either<string, Post>> {
  const id = toPostID(info.relative);
  const metaM = await either.bindAsync(
    getPostDate(info.path, postData.date),
    async (date) => either.right<string, PostMetadata>({
      title: postData.title,
      id: id,
      timestamp: date.getTime(),
      description: postData.description ?? '',
      tags: postData.tags ?? [],
    })
  );
  const bodyM = await transformContent(config, postData.content);
  return either.bind(metaM, meta => either.bind(bodyM, body => either.right<string, Post>({
    metadata: meta,
    body: body,
  })));
}

export async function transformContent(
  config: KestrelConfig,
  content: string,
): Promise<Either<string, string>> {
  if (!config.images?.imageRoot) {
    return either.right(content);
  }
  const rem = remark().use(resolveImageAlias, {
    imageRoot: config.images.imageRoot,
  });
  const file = await rem.process(content);
  return either.right(String(file));
}
