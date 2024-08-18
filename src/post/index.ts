import { Meta } from '@/post/meta';
export * from '@/post/meta';
export * from '@/post/id';

export type Post = Readonly<{
  meta: Meta;
  id: string;
  body: string;
}>;
