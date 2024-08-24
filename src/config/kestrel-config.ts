import path from 'node:path';

export type KestrelConfig = {
  destination: string;
  folders?: {
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
export const defaultPostFolder  = (dest: string) => path.join(dest, 'posts' );
export const defaultImageFolder = (dest: string) => path.join(dest, 'images');

export const defaultImageExtensions = ['png', 'jpg', 'webp', 'gif', 'bmp'];
export const defaultConfig: KestrelConfig = {
  destination: '.',
  folders: {
    posts:  './posts' ,
    images: './images',
  },
  neverInferDate: false,
  optimizeImages: false,
  imageExtensions: defaultImageExtensions,
  quiet: false,
};

export function getPostFolder(config: KestrelConfig): string {
  return config.folders?.posts ?? defaultPostFolder(config.destination);
}

export function getImageFolder(config: KestrelConfig): string {
  return config.folders?.images ?? defaultImageFolder(config.destination);
}

export function prettyConfig(config: KestrelConfig): string {
  return [
    `destination: ${config.destination}`,
    `  posts:  ${getPostFolder(config)}`,
    `  images: ${getImageFolder(config)}`,
    '',
    `infer date: ${config.neverInferDate ? 'never' : 'when needed'}`,
    `resolve image aliases: ${config.images?.imageRoot ? 'yes' : 'no'}`,
  ].join('\n');
}
