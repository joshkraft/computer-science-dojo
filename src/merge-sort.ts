/**
 * Sorts an array of numbers in ascending order.
 *
 * The merge sort algorithm uses the following divide and conquer approach:
 *
 * - if the array has 0 or 1 elements, return the array (it must be sorted)
 * - divide the array into left half and right half
 * - apply merge sort to left half
 * - apply merge sort to right half
 * - merge sorted left half and sorted right half together and return the result
 *
 * @param unsortedArr The array to be sorted.
 * @returns {number[]} A new array representing a sorted copy of the array.
 * @space O(n)
 * @time O(n log n)
 */
export function mergeSort(unsortedArr: number[]): number[] {
  const arr: number[] = [...unsortedArr];

  if (arr.length <= 1) {
    return arr;
  }

  const mid: number = Math.floor(arr.length / 2);

  const left: number[] = arr.slice(0, mid);
  const right: number[] = arr.slice(mid);

  const sortedLeft: number[] = mergeSort(left);
  const sortedRight: number[] = mergeSort(right);

  return mergeSortedArrays(sortedLeft, sortedRight);
}

function mergeSortedArrays(left: number[], right: number[]): number[] {
  const merged: number[] = [];

  let leftIdx = 0;
  let rightIdx = 0;

  while (leftIdx < left.length && rightIdx < right.length) {
    if (left[leftIdx] <= right[rightIdx]) {
      merged.push(left[leftIdx]);
      leftIdx++;
    } else {
      merged.push(right[rightIdx]);
      rightIdx++;
    }
  }

  if (leftIdx < left.length) {
    merged.push(...left.slice(leftIdx));
  }

  if (rightIdx < right.length) {
    merged.push(...right.slice(rightIdx));
  }

  return merged;
}
