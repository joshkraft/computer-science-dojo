import {generateRangeArray} from './utilities/array-utilities';
import {binarySearch} from './binary-search';

describe('Binary Search', () => {
  const input: number[] = generateRangeArray(0, 5);

  test('should return true if array contains target', () => {
    expect(binarySearch(input, 0)).toBe(true);
    expect(binarySearch(input, 2)).toBe(true);
    expect(binarySearch(input, 4)).toBe(true);
  });

  test('should return false if array does not contain target', () => {
    expect(binarySearch(input, -1)).toBe(false);
  });
});
