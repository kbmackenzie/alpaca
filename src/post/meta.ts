import { Either, left, right } from '@/monad/either';
import Ajv from 'ajv';
import type { JTDSchemaType } from 'ajv/dist/jtd';

export type Meta = Readonly<{
  title: string;
  tags?: string[];
  date?: string;
  description?: string;
}>;

const schema: JTDSchemaType<Meta> = {
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
const validate = ajv.compile<Meta>(schema);

export function validateMeta(meta: object): Either<string, Meta> {
  return validate(meta)
    ? right(meta)
    : left(`Invalid post metadata! Errors: ${validate.errors}`);
}
