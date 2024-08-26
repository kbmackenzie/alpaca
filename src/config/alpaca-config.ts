import path from 'node:path';

export type AlpacaConfig = {
  destination: string;
  folders?: {
    posts?:  string;
    images?: string;
  },
  neverInferDate?: boolean;
  optimizeImages?: boolean;
  imageAlias?: string;
  imageExtensions?: string[];
  quiet?: boolean;
};

export const defaultDestination = '.';
export const defaultPostFolder  = (dest: string) => path.join(dest, 'posts' );
export const defaultImageFolder = (dest: string) => path.join(dest, 'images');

export const defaultImageExtensions = ['png', 'jpg', 'webp', 'gif', 'bmp'];
export const defaultConfig: AlpacaConfig = {
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

export function getPostFolder(config: AlpacaConfig): string {
  return config.folders?.posts ?? defaultPostFolder(config.destination);
}

export function getImageFolder(config: AlpacaConfig): string {
  return config.folders?.images ?? defaultImageFolder(config.destination);
}

function yesOrNo(value: any): string {
  return value ? 'yes' : 'no';
}

export function prettyConfig(config: AlpacaConfig): string {
  const imageExtensions = config.imageExtensions ?? defaultImageExtensions;
  return [
    `destination: "${config.destination}"`,
    `  posts:  "${getPostFolder(config)}"`,
    `  images: "${getImageFolder(config)}"`,
    `quiet: ${config.quiet ? 'yes' : 'no'}`,
    `infer date: ${config.neverInferDate ? 'never' : 'as needed'}`,
    `resolve image alias: ${yesOrNo(config.imageAlias)}`,
    `optimize images: ${yesOrNo(config.optimizeImages)}`,
    `image extensions: ${imageExtensions.join(', ')}`,
  ].join('\n');
}
