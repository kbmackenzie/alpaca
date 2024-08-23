import {
  KestrelConfig,
  defaultRoot, 
  defaultPostFolder,
  defaultImageFolder,
  defaultImageExtensions,
} from '@/config/kestrel-config';

export type OptionMap = Partial<{
  'root': string,
  'posts': string,
  'images': string,
  'never-infer-date': boolean;
  'optimize-images': boolean;
  'image-root': string;
  'image-extensions': string;
  'quiet': boolean;
}>;

/* Assumes argument array option like: 'a,b,c,d'.
 * - Allows space(s) after commas.
 * - Forgives trailing comma at the end. */
function parseArray(arg: string): string[] {
  return arg.split(/,\s*/).filter(x => x.length > 0);
}

/* Parse options received from a Commander options object. */
export function parseOptions(options: OptionMap): KestrelConfig {
  const root = options['root'] || defaultRoot;
  return {
    root: root,
    output: {
      posts:  options['posts']  ?? defaultPostFolder(root),
      images: options['images'] ?? defaultImageFolder(root),
    },
    neverInferDate: options['never-infer-date'],
    optimizeImages: options['optimize-images'],
    images: options['image-root'] ? {
      imageRoot: options['image-root']
    } : undefined,
    imageExtensions: options['image-extensions']
      ? parseArray(options['image-extensions'])
      : defaultImageExtensions,
    quiet: options['quiet'],
  };
}
