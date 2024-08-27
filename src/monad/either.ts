/* Note: Module should be imported qualified; i.e. import * as Either from '@/utils/either' */;

export type Either<E, A> =
  | Readonly<{ type: 'left' , value: E }>
  | Readonly<{ type: 'right', value: A }>;

/* Equivalent to Haskell's 'pure' function from the Applicative typeclass. */
export function pure<E, A>(value: A): Either<E, A> {
  return {
    type: 'right',
    value: value,
  };
}

/* Equivalent to Haskell's '>>=' function from the Monad typeclass. */
export function bind<E, A, B>(m: Either<E, A>, f: (value: A) => Either<E, B>): Either<E, B> {
  if (m.type === 'left') return m;
  return f(m.value);
}

/* Equivalent to Haskell's '>>' function from the Monad typeclass. */
export function then<E, A, B>(ma: Either<E, A>, mb: Either<E, B>): Either<E, B> {
  return bind(ma, _ => mb);
}

/* Equivalent to Haskell's 'fmap' function from the Functor typeclass. */
export function fmap<E, A, B>(f: (value: A) => B, m: Either<E, A>): Either<E, B> {
  return bind(m, (a) => pure(f(a)));
}

/* Equivalent to Haskell's '<*' function from the Applicative typeclass. */
export function after<E, A, B>(ma: Either<E, A>, mb: Either<E, B>): Either<E, A> {
  return bind(ma, (a) => bind(mb, _ => pure(a)));
}

export async function bindAsync<E, A, B>(
  promiseM: Promise<Either<E, A>>,
  f: (a: A) => Promise<Either<E, B>>
): Promise<Either<E, B>> {
  const m = await promiseM;
  if (m.type === 'left') return m;
  return f(m.value);
}

export function left<E, A>(e: E): Either<E, A> {
  return {
    type: 'left',
    value: e,
  };
}

export const right = pure;

export function isLeft<E, A>(m: Either<E, A>): m is { type: 'left', value: E } {
  return m.type === 'left';
}

export function isRight<E, A>(m: Either<E, A>): m is { type: 'right', value: A } {
  return m.type === 'right';
}

export function fromEither<E, A, B>(m: Either<E, A>, l: (e: E) => B, r: (a: A) => B): B {
  if (m.type === 'left') return l(m.value);
  return r(m.value);
}

export function pipe<E, A>(initial: Either<E, A>, ...fs: ((a: A) => Either<E, A>)[]): Either<E, A> {
  return fs.reduce((acc, f) => bind(acc, f), initial);
}

export function toThrow<T, A>(m: (t: T) => Either<string, A>): (t: T) => A;
export function toThrow<T, A>(m: Either<string, A>): A;
export function toThrow<T, A>(m: ((t: T) => Either<string, A>) | Either<string, A>): (A | ((t: T) => A)) {
  if (typeof m === 'function') {
    return (t) => {
      const a = m(t);
      if (a.type === 'left') { throw new Error(a.value); }
      return a.value;
    };
  }
  if (m.type === 'left') { throw new Error(m.value); }
  return m.value;
}
