import {naiveStringSearch} from './naive-string-search';

describe('Naive String Search', () => {
  test('should return array of matches where needle occurs in haystack', () => {
    const haystack = 'banana';
    const needle = 'an';

    expect(naiveStringSearch(haystack, needle)).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  test('should return coordinates of entire haystack if needle and haystack are the same', () => {
    const haystack = 'abc';
    const needle = 'abc';

    expect(naiveStringSearch(haystack, needle)).toEqual([[0, 2]]);
  });

  test('should return empty array if needle does not occur in haystack', () => {
    const haystack = 'banana';
    const needle = 'q';

    expect(naiveStringSearch(haystack, needle)).toEqual([]);
  });
});
