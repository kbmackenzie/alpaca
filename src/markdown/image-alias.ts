import { parseImagePath, shouldTransform } from '@/parse/image-path';
import * as either from '@/monad/either';
import { Root } from 'mdast';
import { visit } from 'unist-util-visit';
import { join } from 'node:path/posix';

type Options = {
  imageRoot?: string;
};

export function resolveImageAlias(options?: Options): (tree: Root) => void {
  if (!options?.imageRoot) return (_) => {};
  return (tree) => {
    visit(tree, 'image', node => {
      if (!shouldTransform(node.url)) return;
      if (!options?.imageRoot) return;

      const relative = parseImagePath(node.url);
      if (either.isLeft(relative)) {
        return; /* todo: handle gracefully. */
      }
      node.url = join(options.imageRoot, relative.value);
    });
  }
}
