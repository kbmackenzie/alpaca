import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd.js';

/* ----------------
 * Compiler output:
 * ---------------- */
export type PostMetadata = Readonly<{
  title: string;
  id: string;
  timestamp: number;
  description: string;
  thumbnail?: Image;
  tags: string[];
}>;

export type Image = Readonly<{
  src:  string;
  alt?: string;
}>;

export type BlogPost = Readonly<{
  metadata: PostMetadata;
  body: string;
}>;

/* ----------------
 * Compiler input:
 * ---------------- */
export type PostInfo = Readonly<{
  id: string;
  path: Readonly<{
    absolute: string;
    relative: string;
  }>,
  folder: Readonly<{
    absolute: string;
    relative: string;
  }>,
}>;

export type PostFileMeta = Readonly<{
  title: string;
  date?: string;
  description?: string;
  thumbnail?: Image;
  tags?: string[];
}>;

export type PostFile = PostFileMeta & Readonly<{
  content: string;
}>;

const schema: JTDSchemaType<PostFileMeta> = {
  properties: {
    title: { type: 'string' },
  },
  optionalProperties: {
    tags: {
      elements: { type: 'string' }
    },
    thumbnail: {
      properties: {
        src: { type: 'string' },
      },
      optionalProperties: {
        alt: { type: 'string' },
      },
    },
    date: { type: 'string' },
    description: { type: 'string' },
  },
  additionalProperties: false,
};

const ajv = new Ajv();
const validate = ajv.compile<PostFileMeta>(schema);

export function validatePostMeta(meta: object): Either<string, PostFileMeta> {
  return validate(meta)
    ? either.right(meta)
    : either.left(`Invalid post metadata! Errors: ${ajv.errorsText(validate.errors)}`);
}
