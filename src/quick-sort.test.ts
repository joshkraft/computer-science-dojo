import {generateRandomArray} from './utils/array-utils';
import {quickSort} from './quick-sort';

describe('Quick Sort', () => {
  test('should return an array of numbers sorted in ascending order', () => {
    const input: number[] = generateRandomArray();

    expect(quickSort(input)).toEqual(input.sort((a, b) => a - b));
  });

  test('should not mutate input array', () => {
    const input: number[] = generateRandomArray();
    const originalInput: number[] = [...input];

    quickSort(input);

    expect(input).toEqual(originalInput);
  });

  test('should handle an empty array', () => {
    const input: number[] = [];

    expect(quickSort(input)).toEqual([]);
  });

  test('should handle an array with one element', () => {
    const input: number[] = [1];

    expect(quickSort(input)).toEqual([1]);
  });

  test('should handle duplicate elements', () => {
    const input: number[] = [1, 2, 3, 1, 2, 3];

    expect(quickSort(input)).toEqual([1, 1, 2, 2, 3, 3]);
  });
});
