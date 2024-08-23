import * as either from '@/monad/either';
import { parsePostDate } from '@/parse/date';

describe('parse post date', () => {
  type Expectation = {
    input: string;
    expected: Date;
  };

  const dates: Expectation[] = [
    { input: '08-23-24 3:37am' , expected: new Date(2024, 23, 7,  3, 37) },
    { input: '01-01-24 12:00am', expected: new Date(2024, 1 , 0,  0, 0 ) },
    { input: '01-01-20 12:00pm', expected: new Date(2020, 1 , 0, 12, 0 ) },
  ];

  test.each(dates)('is parsed as a valid date object', ({ input, expected }) => {
    const date = either.toThrow(parsePostDate(input));
    expect(date.getDay()).toBe(expected.getDay());
    expect(date.getMonth()).toBe(expected.getMonth());
    expect(date.getFullYear()).toBe(expected.getFullYear());
    expect(date.getHours()).toBe(expected.getHours());
    expect(date.getMinutes()).toBe(expected.getMinutes());
    expect(date.getTime()).toBe(expected.getTime());
  });

  const invalidDates: string[][] = [
    '08-23-24',
    '3:37am',
    '08-24-243:37am',
    '08/23/24 3:37am',
    '08-23-24 3:37',
    '08-23-24 3:37mm',
  ].map(x => [x]);

  test.each(invalidDates)('results in a parser failure', (input) => {
    const parse = () => either.toThrow(parsePostDate(input));
    expect(parse).toThrow();
  });
});
