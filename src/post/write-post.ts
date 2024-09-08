import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { AlpacaConfig } from '@/config/alpaca-config';
import { getPostDate } from '@/post/post-date';
import { BlogPost, Image, PostMetadata, PostFile, PostInfo } from '@/post/post-type';
import { ImageMap } from '@/images/write-images';
import { readPost } from '@/post/read-post';
import { resolveImageAlias } from '@/images/resolve-alias';
import { resolveThumbnail } from '@/images/thumbnail';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';

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
  function createMeta(date: Date, thumbnail: Image | undefined): PostMetadata {
    return {
      title: postData.title,
      id: info.id,
      timestamp: date.getTime(),
      thumbnail: thumbnail,
      description: postData.description ?? '',
      tags: postData.tags ?? [],
    };
  }

  const getMeta = either.bindAsync(
    getPostDate(config, info.path.absolute, postData.date),
    async (date) => either.bind(
      resolveThumbnail(postData.thumbnail, info, imageMap),
      (thumbnail) => either.right(createMeta(date, thumbnail))
    )
  );

  return either.bindAsync(
    getMeta,
    async (meta) => either.bindAsync(
      transformContent(info, postData.content, imageMap),
      async (body) => either.right<string, BlogPost>({
        metadata: meta,
        body: body,
      }),
    ),
  );
}

export async function transformContent(
  post: PostInfo,
  content: string,
  imageMap: ImageMap,
): Promise<Either<string, string>> {
  const rem = remark()
    .use(remarkGfm)
    .use(resolveImageAlias, { post, imageMap, });
  const file = await rem.process(content);
  return either.right(String(file));
}
