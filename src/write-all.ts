import { AlpacaConfig } from '@/config/alpaca-config';
import * as either from '@/monad/either';
import { compilePost } from '@/post/write-post';
import { PostInfo, PostMetadata } from '@/post/post-type';
import { findPosts } from '@/post/find-posts';
import { nubBy } from '@/utils/nub';
import { buildFolder, postFolder, imageFolder } from '@/constants';
import fs from 'node:fs/promises'
import path from 'node:path';
import { Logger } from 'winston';
import { copyImages } from '@/images/copy-images';

/* Note: The functions below are impure and do unchecked IO.
 * Do error-handling around them. */

export async function writeAll(
  config: AlpacaConfig,
  folder: string,
  logger?: Logger
): Promise<void> {
  logger?.info(`Searching for posts in path "${folder}"...`);
  const postInfos = await findPosts(config, folder)
    .then(posts => nubBy(posts, post => post.id));

  logger?.info(`Found ${postInfos.length} posts!`);

  /* Clean destination folder and begin building from scratch. */
  await fs.rm(buildFolder, { recursive: true, force: true, });
  await fs.mkdir(buildFolder, { recursive: true, });

  await fs.mkdir(postFolder,  { recursive: true });
  await fs.mkdir(imageFolder, { recursive: true });

  await writePosts(config, postInfos, logger);
  await writeImages(config, postInfos, logger);
}

async function writePosts(
  config: AlpacaConfig,
  postInfos: PostInfo[],
  logger?: Logger
): Promise<void> {
  const metadata: PostMetadata[] = [];

  for (const info of postInfos) {
    logger?.info(`Compiling post "${info.path.relative}"...`);

    const result = await either.bindAsync(
      compilePost(config, info),
      async (post) => {
        const filepath = path.join(postFolder, `${info.id}.json`);
        const content  = JSON.stringify(post);
        fs.writeFile(filepath, content)

        return either.right(post.metadata);
      }
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

async function writeImages(
  config: AlpacaConfig,
  postInfos: PostInfo[],
  logger?: Logger
): Promise<void> {
  for (const info of postInfos) {
    logger?.info(`Copying images from "${info.path.relative}"...`);
    const folder = path.join(imageFolder, info.id);
    
    const copied = await copyImages(config, info.folder.absolute, folder);
    const logged = either.bind(copied, (errors) => {
      errors.forEach(error => logger?.error(error));
      return either.right(undefined);
    });
    if (either.isLeft(logged)) { logger?.error(logged.value); }
  }
}
