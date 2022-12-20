import {generateRandomArray} from '../utilities/array-utilities';
import {SelectionSort} from './selection-sort';

describe('Selection Sort', () => {
  test('should sort array', () => {
    const unsortedArr = generateRandomArray();

    const result = SelectionSort.sort(unsortedArr);

    expect(result).toEqual(unsortedArr.sort((a, b) => a - b));
  });
});
