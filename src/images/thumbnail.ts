import { parseImagePath } from '@/images/image-alias';
import { ImageMap } from '@/images/write-images';
import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { Image, PostInfo } from '@/post/post-type';
import path from 'node:path';

export function resolveThumbnail(
  image: Image | undefined,
  post: PostInfo,
  imageMap: ImageMap,
): Either<string, Image | undefined> {
  if (!image) return either.right(undefined);

  const resolve = (relative: string): Either<string, Image | undefined> => {
    const realPath = path.join(post.folder.absolute, relative);
    const newPath  = imageMap.get(realPath);
    if (!newPath) return either.right(undefined);

    return either.right({
      ...image,
      src: newPath,
    });
  };

  return either.bind(
    parseImagePath(image.src),
    resolve,
  );
}
