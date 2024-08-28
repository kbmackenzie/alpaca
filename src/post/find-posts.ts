import { AlpacaConfig, getIgnorePatterns } from '@/config/alpaca-config';
import { toPostID } from '@/post/post-id';
import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { PostInfo } from '@/post/post-type';
import path from 'node:path';
import fg from 'fast-glob';

export const postFile = 'post.md';

export async function findPosts(config: AlpacaConfig, start: string): Promise<PostInfo[]> {
  const root = path.resolve(start);
  const posts = await fg(`**/${postFile}`, {
    cwd: root,
    onlyFiles: true,
    ignore: getIgnorePatterns(config),
  });
  return posts.map(post => {
    const folder = path.dirname(post);
    const id = toPostID(folder);
    return {
      id: id,
      path: {
        absolute: path.join(root, post),
        relative: post,
      },
      folder: {
        absolute: path.join(root, folder),
        relative: folder,
      },
    };
  });
}

export async function tryFindPosts(config: AlpacaConfig, folder: string): Promise<Either<string, PostInfo[]>> {
  try {
    const posts = await findPosts(config, folder);
    return either.right<string, PostInfo[]>(posts);
  }
  catch (error) {
    return either.left<string, PostInfo[]>(
      `Couldn't glob post files from folder "${folder}": ${String(error)}`
    );
  }
}
