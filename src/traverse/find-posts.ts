import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { postContents } from '@/constants';
import { opendir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

export type PostInfo = Readonly<{
  path:     string;
  relative: string;
}>;

type Searcher = Readonly<{
  start: string;
  posts: PostInfo[];
}>;

export async function tryFindPosts(start: string): Promise<Either<string, PostInfo[]>> {
  try {
    const posts = await findPosts(start);
    return either.right<string, PostInfo[]>(posts);
  }
  catch (error) {
    return either.left<string, PostInfo[]>(`Error when looking for posts in path "${start}": ${String(error)}`);
  }
}

export async function findPosts(start: string): Promise<PostInfo[]> {
  const traversal = await traverseFolders(start);
  return traversal.posts;
}

/* The voyage to the corner of the globe is a real trip. */
async function traverseFolders(start: string): Promise<Searcher> {
  const searcher: Searcher = {
    start: path.normalize(start),
    posts: [],
  };
  await searchPostsDFS(searcher, start);
  return searcher;
}

/* Depth-first search. */
async function searchPostsDFS(searcher: Searcher, folder: string): Promise<void> {
  const dir = await opendir(folder);

  for await (const entry of dir) {
    if (!entry.isDirectory()) continue;
    const entryPath = path.join(folder, entry.name);

    if (isPostFolder(entryPath)) {
      const relative = path.relative(searcher.start, entryPath);
      searcher.posts.push({
        path: entryPath,
        relative: relative,
      });
      continue;
    }
    await searchPostsDFS(searcher, entryPath)
  }
}

function isPostFolder(folder: string): boolean {
  const post = path.join(folder, postContents);
  return existsSync(post);
}
