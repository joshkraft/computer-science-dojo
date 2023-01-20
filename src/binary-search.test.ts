import {generateSortedArray} from './utilities/array-utilities';
import {binarySearch} from './binary-search';

describe('Binary Search', () => {
  const input: number[] = generateSortedArray(0, 5);

  test('should return true if array contains target', () => {
    expect(binarySearch(input, 0)).toEqual(true);
    expect(binarySearch(input, 2)).toEqual(true);
    expect(binarySearch(input, 4)).toEqual(true);
  });

  test('should return false if array does not contain target', () => {
    expect(binarySearch(input, -1)).toEqual(false);
  });
});
