import path from 'node:path';

/* a little hack, honestly. >:'3 todo: rethink this choice. */
export function toPosixPath(input: string): string {
  return input.replaceAll(path.sep, path.posix.sep);
}
