import { parseExtension } from '@/config/alpaca-config';

describe('parse file extensions', () => {
  type Expectation = {
    input: string;
    expected: string;
  };

  const extensions: Expectation[] = [
    { input: '.jpg'   , expected: 'jpg'   },
    { input: 'jpg'    , expected: 'jpg'   },
    { input: ' .png ' , expected: 'png'   },
    { input: '  png'  , expected: 'png'   },
    { input: 'png  '  , expected: 'png'   },
    { input: ' png '  , expected: 'png'   },
    { input: 'webp'   , expected: 'webp'  },
    { input: '.webp'  , expected: 'webp'  },
    { input: 'tiff '  , expected: 'tiff'  },
    { input: '.tiff'  , expected: 'tiff'  },
  ];

  test.each(extensions)('can be parsed', ({ input, expected }) => {
    const ext = parseExtension(input);
    expect(ext).toBe(expected);
  });
});
