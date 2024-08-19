import { MetaFile, validateMetaFile } from '@/traverse/meta-file';
import { Either, right, bind } from '@/monad/either';
import { postContents, postMetaFile } from '@/constants';
import { tryReadFile } from '@/safe/io';
import { readYaml } from '@/safe/yaml';
import { MatterData, yamlMatter } from '@/safe/matter';
import { join } from 'node:path';

type PostData = Readonly<{
  meta: MetaFile;
  body: string;
}>;

export async function readPostData(folder: string): Promise<Either<string, PostData>> {
  const postM = await readContents(folder);
  const metaM = await readMeta(folder);
  return bind(postM, post => bind(metaM, meta => right({
    meta: { ...meta, ...post.meta },
    body: post.body,
  })));
}

async function readMeta(folder: string): Promise<Either<string, MetaFile>> {
  const path = join(folder, postMetaFile);
  return bind(
    await tryReadFile(path),
    buffer => bind(
      readYaml(path, buffer.toString()),
      data => validateMetaFile(data),
    )
  );
}

async function readContents(folder: string) {
  const path = join(folder, postContents);
  return bind(
    await tryReadFile(path),
    buffer => bind(
      yamlMatter(path, buffer),
      matter => getPostData(matter)
    )
  );
}

function getPostData({ data, content }: MatterData): Either<string, PostData> {
  return bind(
    validateMetaFile(data),
    meta => right({
      meta: meta,
      body: content,
    })
  );
}
