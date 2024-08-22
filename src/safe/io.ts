import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { readFile, stat } from 'node:fs/promises';
import { Stats } from 'node:fs';

export async function tryReadFile(path: string): Promise<Either<string, Buffer>> {
  try {
    const buffer = await readFile(path);
    return either.right<string, Buffer>(buffer);
  }
  catch (error) {
    return either.left<string, Buffer>(`Couldn't read file "${path}": ${String(error)}`);
  }
}

export async function tryStat(path: string): Promise<Either<string, Stats>> {
  try {
    const stats = await stat(path);
    return either.right<string, Stats>(stats);
  }
  catch (error) {
    return either.left<string, Stats>(`Couldn't get stats for file "${path}": ${String(error)}`);
  }
}
