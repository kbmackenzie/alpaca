import { Meta } from '@/post/meta.js';
export * from '@/post/meta.js';
export * from '@/post/id.js';

export type Post = Readonly<{
  meta: Meta;
  id: string;
  body: string;
}>;
