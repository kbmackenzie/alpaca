import { Either, left, right } from '@/monad/either';
import Ajv from 'ajv';
import type { JTDSchemaType } from 'ajv/dist/jtd';

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
    ? right(meta)
    : left(`Invalid post metadata! Errors: ${validate.errors}`);
}
