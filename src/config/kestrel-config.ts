export type KestrelConfig = {
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
  appendDate: false,
  neverInferDate: false,
  optimizeImages: false,
  imageExtensions: defaultImageExtensions,
};
