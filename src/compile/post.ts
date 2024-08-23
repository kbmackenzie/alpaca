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
  const id   = toPostID(info.relative);
  const date = await getPostDate(info.path, postData.meta.date)
  const body = await transformContent(config, postData.body);

  if (date.type === 'left') return date;
  if (body.type === 'left') return body;

  const metadata: PostMetadata = {
    title: postData.meta.title,
    id: id,
    timestamp: date.value.getTime(),
    description: postData.meta.description ?? '',
    tags: postData.meta.tags ?? [],
  };

  return either.right<string, Post>({
    metadata: metadata,
    body: body.value,
  });
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
