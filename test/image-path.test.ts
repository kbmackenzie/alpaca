import * as either from '@/monad/either';
import { parseImagePath } from '@/parse/image-path';

describe('parse image alias', () => {
  type Expectation = {
    input: string;
    expected: string;
  };

  const paths: Expectation[] = [
    { input: '@kestrel/cat.png'       , expected: 'cat.png'       },
    { input: '@kestrel/cats/cat.png'  , expected: 'cats/cat.png'  },
  ];

  test.each(paths)('is parsed to a valid relative path', ({ input, expected }) => {
    const path = either.toThrow(parseImagePath(input));
    expect(path).toBe(expected);
  });
});
