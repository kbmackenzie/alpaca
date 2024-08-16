import { PostMetadata } from '@/post/type';

export type Packager = Readonly<{
  currentPath: string;
  postSet: Set<string>;
  metadata: PostMetadata[];
}>;

export function createPackager(path: string): Packager {
  return {
    currentPath: path,
    postSet: new Set(),
    metadata: [],
  };
}

export function withPath(pack: Packager, path: string): Packager {
  return {
    ...pack,
    currentPath: path,
  };
}

export function addPost(pack: Packager, post: PostMetadata): Packager {
  pack.postSet.add(post.id);
  pack.metadata.push(post);
  return pack;
}
