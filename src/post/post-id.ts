const idChar: RegExp = /^[a-zA-Z0-9\-_]$/;
const idRe:   RegExp = /^[a-z0-9\-_]+$/;

export function toPostID(id: string): string {
  const output: string[] = [];
  for (const char of id) {
    output.push(idChar.test(char) ? char.toLowerCase() : '-');
  }
  return output.join('');
}

export function isValidPostID(id: string): boolean {
  return idRe.test(id);
}
