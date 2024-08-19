export type KestrelConfig = {
  appendDate?: boolean;
  neverInferDate?: boolean;
  images?: {
    resolveAlias: boolean;
    imageRoot: string;
  },
  imageExtensions?: string[];
};

export const defaultImageExtensions = ['png', 'jpg', 'webp', 'gif', 'bmp'];
export const defaultConfig: KestrelConfig = {
  appendDate: false,
  neverInferDate: false,
  imageExtensions: defaultImageExtensions,
};
