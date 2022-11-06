import {generateRandomArray} from '../utilities/array-utilities';
import {QuickSort} from './quick-sort';

describe('Quick Sort', () => {
  test('should sort array', () => {
    const unsortedArr = generateRandomArray();

    const result = QuickSort.sort(unsortedArr);

    expect(result).toEqual(unsortedArr.sort((a, b) => a - b));
  });
});
