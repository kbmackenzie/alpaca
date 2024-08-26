import { AlpacaConfig, defaultConfig } from '@/config/alpaca-config';
import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd.js';
import { tryReadFile } from '@/safe/io';
import { tryReadYaml } from '@/safe/yaml';
import path from 'node:path';

const schema: JTDSchemaType<AlpacaConfig> = {
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
    imageAlias: { type: 'string' },
    imageExtensions: { elements: { type: 'string' } },
    quiet: { type: 'boolean' },
  },
  additionalProperties: false,
};

const ajv = new Ajv();
const validate = ajv.compile<AlpacaConfig>(schema);

export function validateConfig(config: object, useDefault?: boolean): Either<string, AlpacaConfig> {
  if (useDefault) return either.right(defaultConfig);
  return validate(config)
    ? either.right(config)
    : either.left(`Invalid config data! Errors: ${ajv.errorsText(validate.errors)}`);
}

export async function readConfig(root: string): Promise<Either<string, AlpacaConfig>> {
  const config = path.join(root, 'alpaca.yaml');
  return either.bindAsync(
    tryReadFile(config),
    async (buffer) => either.bind(
      tryReadYaml(config, buffer.toString()),
      (data) => validateConfig(data)
    )
  );
}
