import {
  AlpacaConfig,
  defaultImageExtensions,
} from '@/config/alpaca-config';

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
export function parseOptions(options: OptionMap): Partial<AlpacaConfig> {
  return {
    destination: options['destination'],
    folders: {
      posts:  options['posts'],
      images: options['images'],
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

export function joinConfig(main: AlpacaConfig, extra: Partial<AlpacaConfig>): AlpacaConfig {
  return {
    destination:     extra.destination ?? main.destination,
    folders: {
      posts:  extra.folders?.posts ?? main.folders?.posts,
      images: extra.folders?.images ?? main.folders?.images,
    },
    neverInferDate:  extra.neverInferDate ?? main.neverInferDate,
    optimizeImages:  extra.optimizeImages ?? main.optimizeImages,
    images:          extra.images ?? main.images,
    imageExtensions: extra.imageExtensions ?? main.imageExtensions,
    quiet:           extra.quiet ?? main.quiet,
  };
}
