import { MetaFile, validateMetaFile } from '@/traverse/meta-file';
import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { Maybe } from '@/monad/maybe';
import * as maybe from '@/monad/maybe';
import { postContents, postMetaFile } from '@/constants';
import { tryReadFile } from '@/safe/io';
import { readYaml } from '@/safe/yaml';
import { MatterData, yamlMatter } from '@/safe/matter';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

export type PostData = MetaFile & Readonly<{
  content: string;
}>;

type ContentFile = Readonly<{
  meta: Maybe<MetaFile>;
  rest: string;
}>;

export async function readPostData(folder: string): Promise<Either<string, PostData>> {
  const postM = await readContents(folder);
  const metaM = await readMeta(folder);
  return either.bind(postM, content => either.bind(metaM, meta => {
    if (content.meta.type === 'nothing' && meta.type === 'nothing') {
      return either.left<string, PostData>(`Expected post metadata in folder "${folder}"; got none!`);
    }
    const allMeta: MetaFile = [content.meta, meta].reduce(
      (acc, x) => {
        if (x.type === 'nothing') return acc;
        return { ...x.value, ...acc };
      },
      { title: 'untitled' },
    );
    return either.right<string, PostData>({
      ...allMeta,
      content: content.rest,
    });
  }));
}

async function readMeta(folder: string): Promise<Either<string, Maybe<MetaFile>>> {
  const path = join(folder, postMetaFile);
  if (!existsSync(path)) {
    return either.right<string, Maybe<MetaFile>>(maybe.nothing);
  }
  const bound = either.bind(
    await tryReadFile(path),
    buffer => either.bind(
      readYaml(path, buffer.toString()),
      data => validateMetaFile(data),
    )
  );
  return either.fmap(maybe.just, bound);
}

async function readContents(folder: string) {
  const path = join(folder, postContents);
  return either.bind(
    await tryReadFile(path),
    buffer => either.bind(
      yamlMatter(path, buffer.toString()),
      matter => getPostData(matter)
    )
  );
}

function getPostData({ data, rest }: MatterData): Either<string, ContentFile> {
  if (data.type === 'nothing') return either.right({
    meta: maybe.nothing,
    rest: rest
  });
  return either.bind(
    validateMetaFile(data.value),
    meta => either.right({
      meta: maybe.just(meta),
      rest: rest,
    })
  );
}
