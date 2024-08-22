/* Note: Module should be imported qualified; i.e. import * as Either from '@/utils/either' */;

export type Either<E, A> =
  | Readonly<{ type: 'left' , value: E }>
  | Readonly<{ type: 'right', value: A }>;

export function pure<E, A>(value: A): Either<E, A> {
  return {
    type: 'right',
    value: value,
  };
}

export function bind<E, A, B>(m: Either<E, A>, f: (value: A) => Either<E, B>): Either<E, B> {
  if (m.type === 'left') return m;
  return f(m.value);
}

export function then<E, A, B>(ma: Either<E, A>, mb: Either<E, B>): Either<E, B> {
  return bind(ma, _ => mb);
}

export function fmap<E, A, B>(f: (value: A) => B, m: Either<E, A>): Either<E, B> {
  return bind(m, (a) => pure(f(a)));
}

/* Equivalent to Haskell's '<*' function. */
export function after<E, A, B>(ma: Either<E, A>, mb: Either<E, B>): Either<E, A> {
  return bind(ma, (a) => bind(mb, _ => pure(a)));
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

export function pipe<E, A>(initial: Either<E, A>, ...fs: ((a: A) => Either<E, A>)[]): Either<E, A> {
  return fs.reduce((acc, f) => bind(acc, f), initial);
}
