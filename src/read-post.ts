import { Either, right, bind } from '@/monad/either';
import { Meta, validateMeta } from '@/post/meta';
import { postContents, postMetaFile } from '@/constants';
import { tryReadFile } from '@/safe/io';
import { readYaml } from '@/safe/yaml';
import { MatterData, yamlMatter } from '@/safe/matter';
import { resolve } from 'node:path';

type Post = {
  meta: Meta;
  body: string;
};

export async function readPost(folder: string): Promise<Either<string, Post>> {
  const postM = await readContents(folder);
  const metaM = await readMeta(folder);
  return bind(postM, post => bind(metaM, meta => right({
    meta: { ...meta, ...post.meta },
    body: post.body,
  })));
}

async function readMeta(folder: string): Promise<Either<string, Meta>> {
  const path = resolve(folder, postMetaFile);
  return bind(
    await tryReadFile(path),
    buffer => bind(
      readYaml(path, buffer.toString()),
      data => validateMeta(data),
    )
  );
}

async function readContents(folder: string) {
  const path = resolve(folder, postContents);
  return bind(
    await tryReadFile(path),
    buffer => bind(
      yamlMatter(path, buffer),
      matter => createPost(matter)
    )
  );
}

function createPost({ data, content }: MatterData): Either<string, Post> {
  return bind(
    validateMeta(data),
    meta => right({
      meta: meta,
      body: content,
    })
  );
}
