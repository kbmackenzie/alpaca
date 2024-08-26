import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { PostInfo } from '@/post/post-type';
import path from 'node:path';
import fg from 'fast-glob';

export const postFile = 'post.md';

export async function findPosts(start: string): Promise<PostInfo[]> {
  const root = path.resolve(start);
  const posts = await fg(`**/${postFile}`, {
    cwd: root,
    onlyFiles: true,
  });
  return posts.map(post => {
    const folder = path.dirname(post);
    return {
      path: path.join(root, post),
      folder: {
        absolute: path.join(root, folder),
        relative: folder,
      },
    };
  });
}

export async function tryFindPosts(folder: string): Promise<Either<string, PostInfo[]>> {
  try {
    const posts = await findPosts(folder);
    return either.right<string, PostInfo[]>(posts);
  }
  catch (error) {
    return either.left<string, PostInfo[]>(
      `Couldn't glob post files from folder "${folder}": ${String(error)}`
    );
  }
}
