import { parseImagePath, shouldTransform } from '@/images/image-alias';
import * as either from '@/monad/either';
import { Root } from 'mdast';
import { visit } from 'unist-util-visit';
import path from 'node:path';
import { ImageMap } from '@/images/write-images';
import { PostInfo } from '@/post/post-type';
import { toPosixPath } from '@/utils/to-posix-path';

export type ResolverOptions = Readonly<{
  post: PostInfo;
  imageMap: ImageMap;
}>;

export function resolveImageAlias({ post, imageMap }: ResolverOptions): (tree: Root) => void {
  return (tree) => {
    visit(tree, 'image', node => {
      if (!shouldTransform(node.url)) return;

      const resolved = either.fmap(
        (relative) => {
          const realPath = path.join(post.folder.absolute, relative);
          return imageMap.get(realPath);
        },
        parseImagePath(node.url),
      );
      if (either.isLeft(resolved) || !resolved.value) {
        return; /* todo: handle gracefully. */
      }
      node.url = toPosixPath(resolved.value);
    });
  }
}
