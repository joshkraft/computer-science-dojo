/**
 * Performs a binary search on a sorted array of numbers to check if the target
 * number exists within it.
 *
 * The binary search technique works by repeatedly shrinking the search window
 * by comparing the middle element in the search window to the target:
 *
 * if middle element is the target:
 *  	stop searching
 *
 * if middle element is smaller than the target:
 *  	search to the right of middle, the elements on the left are too small
 *
 * if middle element is larger than the target:
 *  	search to the left of middle, the elements on the right are too large
 *
 * @param arr The sorted array to search within.
 * @param target The value to search for.
 * @returns Indicates whether the target value exists within the array.
 * @space O(1)
 * @time O(log n)
 */
export function binarySearch(arr: number[], target: number): boolean {
  let l = 0;
  let r = arr.length - 1;

  while (l < r) {
    const mid = Math.floor((l + r) / 2);

    if (arr[mid] === target) {
      return true;
    } else if (arr[mid] < target) {
      l = mid + 1;
    } else {
      r = mid - 1;
    }
  }

  return false;
}
