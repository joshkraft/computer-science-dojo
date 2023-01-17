import {generateRandomArray} from './utilities/array-utilities';
import {selectionSort} from './selection-sort';

describe('Selection Sort', () => {
  test('should return an array of numbers sorted in ascending order', () => {
    const input: number[] = generateRandomArray();

    const result: number[] = selectionSort(input);

    expect(result).toEqual(input.sort((a, b) => a - b));
  });

  test('should not mutate input array', () => {
    const input: number[] = generateRandomArray();
    const originalInput: number[] = [...input];

    selectionSort(input);

    expect(input).toEqual(originalInput);
  });

  test('should handle an empty input array', () => {
    const input: number[] = [];

    const result: number[] = selectionSort(input);

    expect(result).toEqual([]);
  });
});
