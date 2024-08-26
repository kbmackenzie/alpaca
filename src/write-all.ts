import { AlpacaConfig, getImageFolder, getPostFolder } from '@/config/alpaca-config';
import * as either from '@/monad/either';
import { compilePost } from '@/post/write-post';
import { PostInfo, PostMetadata } from '@/post/post-type';
import { toPostID } from '@/post/post-id';
import { findPosts } from '@/post/find-posts';
import { nubBy } from '@/utils/nub';
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
  const postInfos = await findPosts(folder)
    .then(posts => nubBy(posts, post => post.path));

  logger?.info(`Found ${postInfos.length} posts!`);

  const postFolder = getPostFolder(config)
  await fs.mkdir(postFolder, { recursive: true });

  const imageFolder = getImageFolder(config)
  await fs.mkdir(imageFolder, { recursive: true });

  await writePosts(config, postInfos, postFolder, logger);
  await writeImages(config, postInfos, imageFolder, logger);
}

async function writePosts(
  config: AlpacaConfig,
  postInfos: PostInfo[],
  outputFolder: string,
  logger?: Logger
): Promise<void> {
  const metadata: PostMetadata[] = [];

  for (const info of postInfos) {
    logger?.info(`Compiling post "${info.path}"...`);

    const result = await either.bindAsync(
      compilePost(config, info),
      async (post) => {
        const id = toPostID(info.folder.relative);

        const filepath = path.join(outputFolder, id);
        const content  = JSON.stringify(post);
        fs.writeFile(filepath, content)

        return either.right(post.metadata);
      }
    );
    if (result.type === 'left') {
      logger?.error(result.value);
      continue;
    }
    metadata.push(result.value);
  }
  await writeMeta(config, metadata);
}

async function writeMeta(
  config: AlpacaConfig,
  postInfos: PostMetadata[]
): Promise<void> {
  const metaFile = path.join(config.destination, 'meta.json');
  const content  = JSON.stringify(postInfos);
  return fs.writeFile(metaFile, content);
}

async function writeImages(
  config: AlpacaConfig,
  postInfos: PostInfo[],
  outputFolder: string,
  logger?: Logger
): Promise<void> {
  for (const info of postInfos) {
    logger?.info(`Copying images from "${info.path}"...`);

    const id  = toPostID(info.folder.relative);
    const imageFolder = path.join(outputFolder, id);
    
    const copied = await copyImages(config, info.folder.absolute, imageFolder);
    const logged = either.bind(copied, (errors) => {
      errors.forEach(error => logger?.error(error));
      return either.right(undefined);
    });
    if (either.isLeft(logged)) { logger?.error(logged.value); }
  }
}
