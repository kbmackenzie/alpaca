import { AlpacaConfig } from '@/config/alpaca-config';
import * as either from '@/monad/either';
import { compilePost } from '@/post/write-post';
import { BlogPost, PostInfo, PostMetadata } from '@/post/post-type';
import { findPosts } from '@/post/find-posts';
import { nubBy } from '@/utils/nub';
import { buildFolder, postFolder, imageFolder } from '@/constants';
import fs from 'node:fs/promises'
import path from 'node:path';
import { Logger } from 'winston';
import { writeImages } from '@/images/write-images';

/* Note: The functions below are impure and do unchecked IO.
 * Do error-handling around them. */

export async function writeAll(
  config: AlpacaConfig,
  pwd: string,
  logger?: Logger
): Promise<void> {
  logger?.info(`Searching for posts in path "${pwd}"...`);
  const postInfos = await findPosts(config, pwd)
    .then(posts => nubBy(posts, post => post.id));

  logger?.info(`Found ${postInfos.length} posts!`);

  /* Clean destination folder and begin building from scratch. */
  await fs.rm(buildFolder, { recursive: true, force: true, });
  await fs.mkdir(buildFolder, { recursive: true, });

  await fs.mkdir(postFolder,  { recursive: true });
  await fs.mkdir(imageFolder, { recursive: true });
  await writePosts(config, pwd, postInfos, logger);
}

async function writePosts(
  config: AlpacaConfig,
  pwd: string,
  postInfos: PostInfo[],
  logger?: Logger
): Promise<void> {
  const metadata: PostMetadata[] = [];

  for (const info of postInfos) {
    logger?.info(`Compiling post "${info.path.relative}"...`);

    async function writePost(post: BlogPost) {
      const filepath = path.join(postFolder, `${info.id}.json`);
      const content  = JSON.stringify(post);
      fs.writeFile(filepath, content)

      return either.right(post.metadata);
    }

    const result = await either.bindAsync(
      writeImages(config, pwd, info),
      async (imageMap) => either.bindAsync(
        compilePost(config, info, imageMap),
        async (post) => writePost(post),
      )
    );
    either.withEither(
      result,
      (err)  => { logger?.error(err);  },
      (meta) => { metadata.push(meta); },
    );
  }
  await writeMeta(metadata);
}

async function writeMeta(
  postInfos: PostMetadata[]
): Promise<void> {
  const metaFile = path.join(buildFolder, 'meta.json');
  const content  = JSON.stringify(postInfos);
  return fs.writeFile(metaFile, content);
}
