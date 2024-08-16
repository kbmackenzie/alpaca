import { toPostID, isValidPostID } from '@/post/post-id';

describe('post id creation', () => {
  type Expectation = {
    input: string;
    expected: string;
  };

  const posts: Expectation[] = [
    {
      input: 'i love cats',
      expected: 'i-love-cats'
    },
    {
      input: 'Jest is cool!',
      expected: 'jest-is-cool-'
    },
    {
      input: 'Ids should typically not be this long.',
      expected: 'ids-should-typically-not-be-this-long-'
    },
    {
      input: '123456! Numbers are okay too!',
      expected: '123456--numbers-are-okay-too-'
    },
  ];

  test.each(posts)('creates a valid post id', ({ input, expected }) => {
    const id = toPostID(input);
    expect(id).toBe(expected);
  });
});

describe('post id validation', () => {
  type Expectation = {
    input: string;
    expected: boolean;
  };

  const posts: Expectation[] = [
    {
      input: 'i-love-cats',
      expected: true
    },
    {
      input: '---leading-dashes-are-okay-',
      expected: true
    },
    {
      input: 'spaces arent okay',
      expected: false
    },
    {
      input: 'punctuation also isn\'t!',
      expected: false
    },
    {
      input: 'And upper case ALSO isn\'t valid',
      expected: false
    },
  ];

  test.each(posts)('id is correctly validated', ({ input, expected }) => {
    const valid = isValidPostID(input);
    expect(valid).toBe(expected);
  });
});
