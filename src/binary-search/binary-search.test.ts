import {generateRangeArray} from '../utilities/array-utilities';
import {BinarySearch} from './binary-search';

describe('Binary Search', () => {
  test('should find idx of target in sorted arr', () => {
    const arr = generateRangeArray(0, 10);

    expect(BinarySearch.search(arr, 0)).toBe(0);
    expect(BinarySearch.search(arr, 5)).toBe(5);
    expect(BinarySearch.search(arr, 10)).toBe(10);
  });

  test('should return -1 if target does not exist in sorted arr', () => {
    const arr = generateRangeArray(0, 10);

    const result = BinarySearch.search(arr, -1000);

    expect(result).toBe(-1);
  });

  test('should throw error if arr is not sorted', () => {
    const arr = generateRangeArray(0, 10);

    [arr[0], arr[10]] = [arr[10], arr[0]];

    expect(() => {
      BinarySearch.search(arr, 0);
    }).toThrow('arr must be sorted');
  });

  test('should throw error if arr contains duplicate values', () => {
    const arr = generateRangeArray(0, 10);

    arr.push(10);

    expect(() => {
      BinarySearch.search(arr, 0);
    }).toThrow('arr cannot contain duplicate values');
  });
});
