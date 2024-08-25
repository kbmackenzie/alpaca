import { KestrelConfig, defaultConfig } from '@/config/kestrel-config';
import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd.js';
import { tryReadFile } from '@/safe/io';
import { tryReadYaml } from '@/safe/yaml';
import path from 'node:path';

const schema: JTDSchemaType<KestrelConfig> = {
  properties: {
    destination: { type: 'string' },
  },
  optionalProperties: {
    folders: {
      optionalProperties: {
        posts:  { type: 'string' },
        images: { type: 'string' },
      },
    },
    neverInferDate: { type: 'boolean' },
    optimizeImages: { type: 'boolean' },
    images: {
      properties: {
        imageRoot: { type: 'string' },
      },
    },
    imageExtensions: { elements: { type: 'string' } },
    quiet: { type: 'boolean' },
  },
  additionalProperties: false,
};

const ajv = new Ajv();
const validate = ajv.compile<KestrelConfig>(schema);

export function validateConfig(config: object, useDefault?: boolean): Either<string, KestrelConfig> {
  if (useDefault) return either.right(defaultConfig);
  return validate(config)
    ? either.right(config)
    : either.left(`Invalid config data! Errors: ${ajv.errorsText(validate.errors)}`);
}

export async function readConfig(root: string): Promise<Either<string, KestrelConfig>> {
  const kestrel = path.join(root, 'kestrel.yaml');
  return either.bindAsync(
    tryReadFile(kestrel),
    async (buffer) => either.bind(
      tryReadYaml(kestrel, buffer.toString()),
      (data) => validateConfig(data)
    )
  );
}
