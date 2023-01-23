import {generateRandomArray} from './utils/array-utils';
import {selectionSort} from './selection-sort';

describe('Selection Sort', () => {
  test('should return an array of numbers sorted in ascending order', () => {
    const input: number[] = generateRandomArray();

    expect(selectionSort(input)).toEqual(input.sort((a, b) => a - b));
  });

  test('should not mutate input array', () => {
    const input: number[] = generateRandomArray();
    const originalInput: number[] = [...input];

    selectionSort(input);

    expect(input).toEqual(originalInput);
  });

  test('should handle an empty array', () => {
    const input: number[] = [];

    expect(selectionSort(input)).toEqual([]);
  });

  test('should handle an array with one element', () => {
    const input: number[] = [1];

    expect(selectionSort(input)).toEqual([1]);
  });
});
