export type KestrelConfig = {
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

export const defaultImageExtensions = ['png', 'jpg', 'webp', 'gif', 'bmp'];
export const defaultConfig: KestrelConfig = {
  output: {
    posts:  './blog'  ,
    images: './images',
  },
  appendDate: false,
  neverInferDate: false,
  optimizeImages: false,
  imageExtensions: defaultImageExtensions,
};
