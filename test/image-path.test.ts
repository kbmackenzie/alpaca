import * as either from '@/monad/either';
import { parseImagePath, shouldTransform } from '@/images/image-alias';

describe('parse image alias', () => {
  type Expectation = {
    input: string;
    expected: string;
  };

  const paths: Expectation[] = [
    { input: '@alpaca/cat.png'       , expected: 'cat.png'       },
    { input: '@alpaca/cats/cat.png'  , expected: 'cats/cat.png'  },
  ];

  test.each(paths)('is parsed to a valid relative path', ({ input, expected }) => {
    const path = either.toThrow(parseImagePath(input));
    expect(path).toBe(expected);
  });

  const aliased: string[][] = [
    '@alpaca/cat.png',
    '@alpaca/cats/cat.png',
  ].map(x => [x]);

  test.each(aliased)('is correctly identified as a aliased', (input) => {
    const should = shouldTransform(input);
    expect(should).toBe(true);
  });

  const unaliased: string[][] = [
    'cat.png',
    'cats/cat.png',
    'alpaca/cat.png',
    './@alpaca/cat.png',
  ].map(x => [x]);

  test.each(unaliased)('is correctly identified as unaliased', (input) => {
    const should = shouldTransform(input);
    expect(should).toBe(false);
  });
});
