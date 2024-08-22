import { Either } from '@/monad/either';
import * as either from '@/monad/either';
import { readFile, copyFile, stat } from 'node:fs/promises';
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

export async function tryCopyFile(from: string, to: string): Promise<Either<string, void>> {
  try {
    await copyFile(from, to);
  }
  catch (error) {
    return either.left<string, void>(`Couldn't copy file from "${from}" to "${to}": ${String(error)}`);
  }
  return either.right<string, void>(undefined); /* Signal success. */
}
