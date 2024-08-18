export type Maybe<T> =
  | { type: 'just', value: T }
  | { type: 'nothing' };

export function isJust<T>(maybe: Maybe<T>): boolean {
  return maybe.type === 'just';
}

export function isNothing<T>(maybe: Maybe<T>): boolean {
  return maybe.type === 'nothing';
}

/* Equivalent to Haskell's 'fromMaybe' function from Data.Maybe:
 * https://hackage.haskell.org/package/base-4.20.0.1/docs/Data-Maybe.html#v:fromMaybe */
export function fromMaybe<T>(maybe: Maybe<T>, def: T): T {
  if (maybe.type === 'nothing') return def;
  return maybe.value;
}

/* Equivalent to Haskell's 'maybe' function from Data.Maybe:
 * https://hackage.haskell.org/package/base-4.20.0.1/docs/Data-Maybe.html#v:maybe */
export function transformMaybe<T1, T2>(maybe: Maybe<T1>, def: T2, transform: (t: T1) => T2) {
  if (maybe.type === 'nothing') return def;
  return transform(maybe.value);
}
