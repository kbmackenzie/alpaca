import { Meta } from '@/post/meta';

export type Post = Readonly<{
  meta: Meta;
  id: string;
  body: string;
}>;
