import { AlpacaConfig, defaultImageExtensions } from '@/config/alpaca-config';
import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import fg from 'fast-glob';

export async function findImages(config: AlpacaConfig, folder: string): Promise<string[]> {
  const extensions = getExtensions(config);
  if (extensions.length === 0) return [];

  const expr   = `**/*.{${extensions.join(',')}}`;
  const images = await fg(expr, {
    cwd: folder,
    onlyFiles: true,
  });
  return images;
}

const extensionRe = /^\s*\.?([a-z]{3,})\s*$/i;

function getExtensions(config: AlpacaConfig): string[] {
  return (config.imageExtensions ?? defaultImageExtensions).map(ext => {
    const match = extensionRe.exec(ext);
    return match ? match[1] : ext;
  });
}

export async function tryFindImages(config: AlpacaConfig, folder: string): Promise<Either<string, string[]>> {
  try {
    const images = await findImages(config, folder);
    return either.right<string, string[]>(images);
  }
  catch (error) {
    return either.left<string, string[]>(
      `Couldn't glob images from folder "${folder}": ${String(error)}`
    );
  }
}
