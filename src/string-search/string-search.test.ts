import {StringSearch} from './string-search';

describe('String Search', () => {
  test('should return coordinates of substring in string', () => {
    const str = 'banana';
    const substr = 'an';

    const res = StringSearch.findSubstring(str, substr);

    expect(res).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  test('should return empty array if substring is not in string', () => {
    const str = 'banana';
    const substr = 'apple';

    const res = StringSearch.findSubstring(str, substr);

    expect(res).toEqual([]);
  });
});
