import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd.js';

export type MetaFile = Readonly<{
  title: string;
  tags?: string[];
  date?: string;
  description?: string;
}>;

const schema: JTDSchemaType<MetaFile> = {
  properties: {
    title: { type: 'string' },
  },
  optionalProperties: {
    tags: {
      elements: { type: 'string' }
    },
    date: { type: 'string' },
    description: { type: 'string' },
  },
  additionalProperties: false,
};

const ajv = new Ajv();
const validate = ajv.compile<MetaFile>(schema);

export function validateMetaFile(meta: object): Either<string, MetaFile> {
  return validate(meta)
    ? either.right(meta)
    : either.left(`Invalid post metadata! Errors: ${ajv.errorsText(validate.errors)}`);
}
