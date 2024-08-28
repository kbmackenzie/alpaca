import { parseImagePath, shouldTransform } from '@/images/image-alias';
import * as either from '@/monad/either';
import { Root } from 'mdast';
import { visit } from 'unist-util-visit';
import { join } from 'node:path/posix';

type Options = {
  imageRoot: string;
};

export function resolveImageAlias(options: Options): (tree: Root) => void {
  return (tree) => {
    visit(tree, 'image', node => {
      if (!shouldTransform(node.url)) return;

      const resolved = either.fmap(
        (relative) => join(options.imageRoot, relative),
        parseImagePath(node.url),
      );
      if (either.isLeft(resolved)) return; /* todo: handle gracefully. */
      node.url = resolved.value;
    });
  }
}
