import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { getPostDate } from '@/parse/date';
import { toPostID } from '@/post/id';
import { Post, PostMetadata } from '@/post/post';
import { PostInfo } from '@/traverse/find-posts';
import { PostData, readPostData } from '@/traverse/read-post';
import { resolveImageAlias } from '@/markdown/image-alias';
import { remark } from 'remark';

export async function compilePost(
  info: PostInfo,
  imageRoot: string
): Promise<Either<string, string>> {
  const postM = await either.bindAsync(
    readPostData(info.path),
    (postData) => createPost(info, postData, imageRoot)
  );
  return either.fmap(post => JSON.stringify(post), postM);
}

export async function createPost(
  info: PostInfo,
  postData: PostData,
  imageRoot: string
): Promise<Either<string, Post>> {
  const id   = toPostID(info.relative);
  const date = await getPostDate(info.path, postData.meta.date)
  const body = await transformContent(postData.body, imageRoot);

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
  content: string,
  imageRoot: string
): Promise<Either<string, string>> {
  const rem = remark().use(resolveImageAlias, {
    resolve: true,
    imageRoot: imageRoot,
  });
  const file = await rem.process(content);
  return either.right(String(file));
}
