import { AlpacaConfig } from '@/config/alpaca-config';
import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd.js';
import { tryReadFile } from '@/safe/io';
import { tryReadYaml } from '@/safe/yaml';
import { configFile } from '@/constants';
import path from 'node:path';

const schema: JTDSchemaType<AlpacaConfig> = {
  optionalProperties: {
    quiet: { type: 'boolean' },
    logFile: { type: 'boolean' },
    neverInferDate: { type: 'boolean' },
    optimizeImages: { type: 'boolean' },
    imageAlias: { type: 'string' },
    imageExtensions: { elements: { type: 'string' } },
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
