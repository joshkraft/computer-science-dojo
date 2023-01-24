/**
 * Sorts an array of numbers in ascending order.
 *
 * The quick sort algorithm uses a divide and conquer approach that works by:
 *
 * - select a 'pivot' element from the array to serve as a partition
 * - divide the remaining elements into groups:
 * 		- left: less than pivot
 * 		- center: equal to pivot (includes pivot itself)
 * 		- right: greater than pivot
 * - apply quick sort to left and right groups
 * - return the merged result: [sortedLeft, center, sortedRight]
 *
 * Note: a number of optimizations exist for quick sort, which can improve the
 * space and time performance of the algorithm. However, they increase the
 * complexity of the implementation. For more information, see
 * https://en.wikipedia.org/wiki/Quicksort
 *
 * @param unsortedArr The array to be sorted.
 * @returns {number[]} A new array representing a sorted copy of the array.
 * @space O(n)
 * @time O(n log n)
 */
export function quickSort(unsortedArr: number[]): number[] {
  const arr: number[] = [...unsortedArr];

  if (arr.length <= 1) {
    return arr;
  }

  const pivot: number = Math.floor(arr.length / 2);

  const left: number[] = [];
  const center: number[] = [];
  const right: number[] = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === arr[pivot]) {
      center.push(arr[i]);
    } else if (arr[i] < arr[pivot]) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return [...quickSort(left), ...center, ...quickSort(right)];
}
