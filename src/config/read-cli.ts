import {
  KestrelConfig,
  defaultDestination, 
  defaultPostFolder,
  defaultImageFolder,
  defaultImageExtensions,
} from '@/config/kestrel-config';

export type OptionMap = Partial<{
  'destination': string,
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
  const dest = options['destination'] || defaultDestination;
  return {
    destination: dest,
    folders: {
      posts:  options['posts']  ?? defaultPostFolder(dest),
      images: options['images'] ?? defaultImageFolder(dest),
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

export function joinConfig(main: KestrelConfig, extra: Partial<KestrelConfig>): KestrelConfig {
  return {
    destination:     extra.destination ?? main.destination,
    folders:         extra.folders ?? main.folders,
    neverInferDate:  extra.neverInferDate ?? main.neverInferDate,
    optimizeImages:  extra.optimizeImages ?? main.optimizeImages,
    images:          extra.images ?? main.images,
    imageExtensions: extra.imageExtensions ?? main.imageExtensions,
    quiet:           extra.quiet ?? main.quiet,
  };
}
