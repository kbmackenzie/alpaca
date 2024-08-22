import {compilePost} from '@/compile/post';
import { KestrelConfig } from '@/config/kestrel-config';
import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { getPostDate } from '@/parse/date';
import { toPostID } from '@/post/id';
import { Post, PostMetadata } from '@/post/post';
import {copyImages} from '@/traverse/find-images';
import { findPosts, PostInfo, tryFindPosts } from '@/traverse/find-posts';
import { PostData, readPostData } from '@/traverse/read-post';
import {nubBy} from '@/utils/nub';
import fs from 'node:fs/promises'
import path from 'node:path';
import { Logger } from 'winston';

export type OutputPaths = {
  posts:  string;
  images: string;
};

/* Note: The functions below are impure and do unchecked IO.
 * Do error-handling around them. */

export async function writePosts(
  config: KestrelConfig,
  root: string,
  output: OutputPaths,
  logger?: Logger
): Promise<void> {
  logger?.info(`Searching for posts in path "${root}"...`);

  const postInfos = await findPosts(root)
    .then(posts => nubBy(posts, post => post.path));

  logger?.info(`Found ${postInfos.length} posts!`);

  /* todo: make asynchronous, handle promises in batches. */
  for (const info of postInfos) {
    logger?.info(`Compiling post "${info.path}"...`);

    const result = await compilePost(info);
    if (result.type === 'left') {
      logger?.error(result.value);
      continue;
    }
    const post = result.value;
    const id   = toPostID(info.relative);

    const filepath = path.join(output.posts, id);
    fs.writeFile(filepath, post)
  }
}


