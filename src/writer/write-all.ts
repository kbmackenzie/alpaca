import { KestrelConfig, getImageFolder, getPostFolder } from '@/config/kestrel-config';
import * as either from '@/monad/either';
import { compilePost } from '@/compile/post';
import { toPostID } from '@/post/id';
import { findPosts, PostInfo } from '@/traverse/find-posts';
import { nubBy } from '@/utils/nub';
import fs from 'node:fs/promises'
import path from 'node:path';
import { Logger } from 'winston';
import {copyImages} from '@/traverse/find-images';

/* Note: The functions below are impure and do unchecked IO.
 * Do error-handling around them. */

export async function writeAll(
  config: KestrelConfig,
  root: string,
  logger?: Logger
): Promise<void> {
  logger?.info(`Searching for posts in path "${root}"...`);
  const postInfos = await findPosts(root)
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
  config: KestrelConfig,
  postInfos: PostInfo[],
  outputFolder: string,
  logger?: Logger
): Promise<void> {
  for (const info of postInfos) {
    logger?.info(`Compiling post "${info.path}"...`);

    const result = await compilePost(config, info);
    if (either.isLeft(result)) {
      logger?.error(result.value);
      continue;
    }
    const post = result.value;
    const id   = toPostID(info.relative);
    const filepath = path.join(outputFolder, id);
    fs.writeFile(filepath, post)
  }
}

async function writeImages(
  config: KestrelConfig,
  postInfos: PostInfo[],
  outputFolder: string,
  logger?: Logger
): Promise<void> {
  for (const info of postInfos) {
    logger?.info(`Copying images from "${info.path}"...`);

    const id  = toPostID(info.relative);
    const imageFolder = path.join(outputFolder, id);
    
    const copied = await copyImages(config, info.path, imageFolder);
    const logged = either.bind(copied, (errors) => {
      errors.forEach(error => logger?.error(error));
      return either.right(undefined);
    });
    if (either.isLeft(logged)) { logger?.error(logged.value); }
  }
}
