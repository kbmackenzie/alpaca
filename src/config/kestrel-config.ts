import path from 'node:path';

export type KestrelConfig = {
  root: string;
  output?: {
    posts?:  string;
    images?: string;
  },
  neverInferDate?: boolean;
  optimizeImages?: boolean;
  images?: {
    imageRoot: string;
  },
  imageExtensions?: string[];
  quiet?: boolean;
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
  neverInferDate: false,
  optimizeImages: false,
  imageExtensions: defaultImageExtensions,
  quiet: false,
};

export function getPostFolder(config: KestrelConfig): string {
  return config.output?.posts ?? defaultPostFolder(config.root);
}

export function getImageFolder(config: KestrelConfig): string {
  return config.output?.images ?? defaultImageFolder(config.root);
}
