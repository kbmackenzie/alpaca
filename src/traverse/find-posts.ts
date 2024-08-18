import { postContents } from '@/constants';
import { opendir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

export type PostInfo = Readonly<{
  path:     string;
  relative: string;
}>;

type Searcher = Readonly<{
  root:  string;
  posts: PostInfo[];
}>;

export async function findPosts(root: string): Promise<PostInfo[]> {
  const traversal = await traverseRoot(root);
  return traversal.posts;
}

/* The voyage to the corner of the globe is a real trip. */
async function traverseRoot(root: string): Promise<Searcher> {
  const searcher: Searcher = {
    root:  path.normalize(root),
    posts: [],
  };
  await searchPostsDFS(searcher, root);
  return searcher;
}

/* Depth-first search. */
async function searchPostsDFS(searcher: Searcher, folder: string): Promise<void> {
  const dir = await opendir(folder);

  for await (const entry of dir) {
    if (!entry.isDirectory()) continue;
    const entryPath = path.resolve(folder, entry.name);

    if (isPostFolder(entryPath)) {
      const relative = path.relative(searcher.root, entryPath);
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
  const post = path.resolve(folder, postContents);
  return existsSync(post);
}
