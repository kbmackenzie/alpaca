import path from 'node:path';

export type KestrelConfig = {
  destination: string;
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

export const defaultDestination = '.';
export const defaultPostFolder  = (root: string) => path.join(root, 'posts' );
export const defaultImageFolder = (root: string) => path.join(root, 'images');

export const defaultImageExtensions = ['png', 'jpg', 'webp', 'gif', 'bmp'];
export const defaultConfig: KestrelConfig = {
  destination: '.',
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
  return config.output?.posts ?? defaultPostFolder(config.destination);
}

export function getImageFolder(config: KestrelConfig): string {
  return config.output?.images ?? defaultImageFolder(config.destination);
}
