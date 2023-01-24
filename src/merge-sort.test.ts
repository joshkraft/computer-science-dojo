import {generateRandomArray} from './utils/array-utils';
import {mergeSort} from './merge-sort';

describe('Merge Sort', () => {
  test('should return an array of numbers sorted in ascending order', () => {
    const input: number[] = generateRandomArray();

    expect(mergeSort(input)).toEqual(input.sort((a, b) => a - b));
  });

  test('should not mutate input array', () => {
    const input: number[] = generateRandomArray();
    const originalInput: number[] = [...input];

    mergeSort(input);

    expect(input).toEqual(originalInput);
  });

  test('should handle an empty array', () => {
    const input: number[] = [];

    expect(mergeSort(input)).toEqual([]);
  });

  test('should handle an array with one element', () => {
    const input: number[] = [1];

    expect(mergeSort(input)).toEqual([1]);
  });

  test('should handle duplicate elements', () => {
    const input: number[] = [1, 2, 3, 1, 2, 3];

    expect(mergeSort(input)).toEqual([1, 1, 2, 2, 3, 3]);
  });
});
