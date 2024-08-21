export type Maybe<A> =
  | Readonly<{ type: 'just', value: A }>
  | Readonly<{ type: 'nothing' }>;

export function pure<A>(value: A): Maybe<A> {
  return {
    type: 'just',
    value: value,
  };
}

export function bind<A, B>(m: Maybe<A>, f: (a: A) => Maybe<B>): Maybe<B> {
  if (m.type === 'nothing') return m;
  return f(m.value);
}

export function then<A, B>(ma: Maybe<A>, mb: Maybe<B>): Maybe<B> {
  return bind(ma, _ => mb);
}

export function fmap<A, B>(f: (a: A) => B, ma: Maybe<A>): Maybe<B> {
  return bind(ma, (a) => pure(f(a)));
}

export const just = pure;
export const nothing: Maybe<any> = { type: 'nothing' };

export function isJust<A>(maybe: Maybe<A>): maybe is { type: 'just', value: A } {
  return maybe.type === 'just';
}

export function isNothing<A>(maybe: Maybe<A>): maybe is { type: 'nothing' } {
  return maybe.type === 'nothing';
}

/* Equivalent to Haskell's 'fromMaybe' function from Data.Maybe:
 * https://hackage.haskell.org/package/base-4.20.0.1/docs/Data-Maybe.html#v:fromMaybe */
export function fromMaybe<A>(maybe: Maybe<A>, def: A): A {
  if (maybe.type === 'nothing') return def;
  return maybe.value;
}

/* Equivalent to Haskell's 'maybe' function from Data.Maybe:
 * https://hackage.haskell.org/package/base-4.20.0.1/docs/Data-Maybe.html#v:maybe */
export function transformMaybe<A1, A2>(maybe: Maybe<A1>, def: A2, transform: (t: A1) => A2) {
  if (maybe.type === 'nothing') return def;
  return transform(maybe.value);
}
