import { PostDate } from '@/post/date';

export type Meta = Readonly<{
  title: string;
  tags: string[];
  date?: PostDate;
  description?: string;
}>;

export function validateMeta(meta: Partial<Meta>) {
}
