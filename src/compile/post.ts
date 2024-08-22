import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { getPostDate } from '@/parse/date';
import { toPostID } from '@/post/id';
import { Post, PostMetadata } from '@/post/post';
import { PostInfo } from '@/traverse/find-posts';
import { PostData, readPostData } from '@/traverse/read-post';

export async function compilePost(info: PostInfo): Promise<Either<string, string>> {
  const postData = await readPostData(info.path)
  const fullPost = postData.type === 'left' ? postData : await createPost(info, postData.value);
  return either.fmap(post => JSON.stringify(post), fullPost);
}

export async function createPost(post: PostInfo, data: PostData): Promise<Either<string, Post>> {
  const id   = toPostID(post.relative);
  const date = await getPostDate(post.path, data.meta.date)
  if (date.type === 'left') return date;

  const metadata: PostMetadata = {
    title: data.meta.title,
    id: id,
    timestamp: date.value.getTime(),
    description: data.meta.description ?? '',
    tags: data.meta.tags ?? [],
  };

  return either.right<string, Post>({
    metadata: metadata,
    body: data.body,
  });
}
