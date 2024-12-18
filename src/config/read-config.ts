import { AlpacaConfig } from '@/config/alpaca-config';
import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd.js';
import { tryReadFile } from '@/safe/io';
import { tryReadYaml } from '@/safe/yaml';
import { configFile } from '@/constants';
import path from 'node:path';
import { existsSync } from 'node:fs';

const schema: JTDSchemaType<AlpacaConfig> = {
  optionalProperties: {
    quiet: { type: 'boolean' },
    ['log-file']: { type: 'boolean' },
    ['never-infer-date']: { type: 'boolean' },
    ['preserve-images']: { type: 'boolean' },
    ['image-alias']: { type: 'string' },
    ['image-extensions']: { elements: { type: 'string' } },
    ignore: { elements: { type: 'string' } },
  },
  additionalProperties: false,
};

const ajv = new Ajv();
const validate = ajv.compile<AlpacaConfig>(schema);

export function validateConfig(config: object): Either<string, AlpacaConfig> {
  return validate(config)
    ? either.right(config)
    : either.left(`Invalid config data! Errors: ${ajv.errorsText(validate.errors)}`);
}

export async function readConfig(root: string): Promise<Either<string, AlpacaConfig>> {
  const config = path.join(root, configFile);
  return either.bindAsync(
    tryReadFile(config),
    async (buffer) => either.bind(
      tryReadYaml(config, buffer.toString()),
      (data) => validateConfig(data)
    )
  );
}

export function hasConfig(root: string): boolean {
  const config = path.join(root, configFile);
  return existsSync(config);
}
