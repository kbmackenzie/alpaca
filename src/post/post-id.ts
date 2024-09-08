const idRe = /^[a-z0-9\-_]+$/;
const notValidRe = /[^a-zA-Z0-9\-_]/g;

export function toPostID(id: string): string {
  return id.replace(notValidRe, '-').toLowerCase();
}

export function isValidPostID(id: string): boolean {
  return idRe.test(id);
}
