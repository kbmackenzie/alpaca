import * as either from '@/monad/either';
import { parseImagePath, shouldTransform } from '@/parse/image-path';

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

  const aliased: string[][] = [
    '@kestrel/cat.png',
    '@kestrel/cats/cat.png',
  ].map(x => [x]);

  test.each(aliased)('is correctly identified as a aliased', (input) => {
    const should = shouldTransform(input);
    expect(should).toBe(true);
  });

  const unaliased: string[][] = [
    'cat.png',
    'cats/cat.png',
    'kestrel/cat.png',
    './@kestrel/cat.png',
  ].map(x => [x]);

  test.each(unaliased)('is correctly identified as unaliased', (input) => {
    const should = shouldTransform(input);
    expect(should).toBe(false);
  });
});
