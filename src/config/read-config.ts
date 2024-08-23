import { KestrelConfig, defaultConfig } from '@/config/kestrel-config';
import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import type { JTDSchemaType } from 'ajv/dist/core';
import Ajv from 'ajv';

const schema: JTDSchemaType<KestrelConfig> = {
  optionalProperties: {
    output: {
      optionalProperties: {
        posts:  { type: 'string' },
        images: { type: 'string' },
      },
    },
    appendDate: { type: 'boolean' },
    neverInferDate: { type: 'boolean' },
    optimizeImages: { type: 'boolean' },
    images: {
      properties: {
        imageRoot: { type: 'string' },
      },
      optionalProperties: {
        resolveAlias: { type: 'boolean' },
      },
    },
    imageExtensions: { elements: { type: 'string' } },
  },
  additionalProperties: false,
};

const ajv = new Ajv();
const validate = ajv.compile<KestrelConfig>(schema);

export function validateConfig(config: object, useDefault?: boolean): Either<string, KestrelConfig> {
  if (useDefault) return either.right(defaultConfig);
  return validate(config)
    ? either.right(config)
    : either.left(`Invalid config data! Errors: ${validate.errors}`);
}
