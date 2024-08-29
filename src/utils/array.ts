export function forgiveJoin<T>(a?: T[], b?: T[]): T[] {
  let output: T[] = [];
  output = a ? output.concat(a) : output;
  output = b ? output.concat(b) : output;
  return output;
}

export function getLongest<T>(a: T[], b: T[]): T[] {
  return (a.length > b.length) ? a : b;
}
