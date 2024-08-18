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

export function left<E, A>(e: E): Either<E, A> {
  return {
    type: 'left',
    value: e,
  };
}

export const right = pure;

export function isLeft<E, A>(m: Either<E, A>): boolean {
  return m.type === 'left';
}

export function isRight<E, A>(m: Either<E, A>): boolean {
  return m.type === 'right';
}
