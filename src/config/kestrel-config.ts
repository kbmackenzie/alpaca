import path from 'node:path';

export type KestrelConfig = {
  root: string;
  output?: {
    posts?:  string;
    images?: string;
  },
  appendDate?: boolean;
  neverInferDate?: boolean;
  optimizeImages?: boolean;
  images?: {
    resolveAlias?: boolean;
    imageRoot: string;
  },
  imageExtensions?: string[];
};

export const defaultRoot = '.';
export const defaultPostFolder  = (root: string) => path.join(root, 'posts' );
export const defaultImageFolder = (root: string) => path.join(root, 'images');

export const defaultImageExtensions = ['png', 'jpg', 'webp', 'gif', 'bmp'];
export const defaultConfig: KestrelConfig = {
  root: '.',
  output: {
    posts:  './posts' ,
    images: './images',
  },
  appendDate: false,
  neverInferDate: false,
  optimizeImages: false,
  imageExtensions: defaultImageExtensions,
};
