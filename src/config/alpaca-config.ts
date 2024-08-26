import path from 'node:path';
import fg from 'fast-glob';

export type AlpacaConfig = {
  destination: string;
  folders?: {
    posts?:  string;
    images?: string;
  },
  quiet?: boolean;
  neverInferDate?: boolean;
  optimizeImages?: boolean;
  imageAlias?: string;
  imageExtensions?: string[];
  ignore?: string[];
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
  quiet: false,
  neverInferDate: false,
  optimizeImages: false,
  imageExtensions: defaultImageExtensions,
  ignore: [],
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
  const ignored = config.ignore?.map(x => `"${x}"`).join(', ') ?? '[]';
  return [
    `destination: "${config.destination}"`,
    `  posts:  "${getPostFolder(config)}"`,
    `  images: "${getImageFolder(config)}"`,
    `quiet: ${config.quiet ? 'yes' : 'no'}`,
    `infer date: ${config.neverInferDate ? 'never' : 'as needed'}`,
    `resolve image alias: ${yesOrNo(config.imageAlias)}`,
    `optimize images: ${yesOrNo(config.optimizeImages)}`,
    `image extensions: ${imageExtensions.join(', ')}`,
    `ignore: ${ignored}`,
  ].join('\n');
}

export function getIgnorePatterns(config: AlpacaConfig): string[] {
  const destination = fg.convertPathToPattern(config.destination) + '/**';
  if (!config.ignore) return [destination];
  return [destination, ...config.ignore];
}
