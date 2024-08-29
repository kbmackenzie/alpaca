import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { AlpacaConfig, defaultImageAlias } from '@/config/alpaca-config';
import { getPostDate } from '@/post/post-date';
import { BlogPost, PostMetadata, PostFile, PostInfo } from '@/post/post-type';
import { ImageMap } from '@/images/copy-images';
import { readPost } from '@/post/read-post';
import { resolveImageAlias } from '@/images/resolve-alias';
import { remark } from 'remark';

export async function compilePost(
  config: AlpacaConfig,
  info: PostInfo,
  imageMap: ImageMap
): Promise<Either<string, BlogPost>> {
  return await either.bindAsync(
    readPost(info.path.absolute),
    (postData) => createPost(config, info, postData, imageMap)
  );
}

export async function createPost(
  config: AlpacaConfig,
  info: PostInfo,
  postData: PostFile,
  imageMap: ImageMap,
): Promise<Either<string, BlogPost>> {
  function createMeta(date: Date): PostMetadata {
    return {
      title: postData.title,
      id: info.id,
      timestamp: date.getTime(),
      description: postData.description ?? '',
      tags: postData.tags ?? [],
    };
  }
  return either.bindAsync(
    getPostDate(config, info.path.absolute, postData.date),
    async (date) => either.bindAsync(
      transformContent(config, info, postData.content, imageMap),
      async (body) => either.right<string, BlogPost>({
        metadata: createMeta(date),
        body: body,
      }),
    ),
  );
}

export async function transformContent(
  config: AlpacaConfig,
  post: PostInfo,
  content: string,
  imageMap: ImageMap,
): Promise<Either<string, string>> {
  const imageRoot = config.imageAlias ?? defaultImageAlias;
  const rem = remark().use(
    resolveImageAlias,
    { imageRoot, post, imageMap, }
  );
  const file = await rem.process(content);
  return either.right(String(file));
}
