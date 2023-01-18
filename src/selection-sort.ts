/**
 * Sorts an array of numbers in ascending order.
 *
 * The selection sort algorithm works by repeatedly finding the smallest element
 * from the unsorted portion of the array and swapping it with the first element
 * of the unsorted portion.
 *
 * This effectively 'expands' the sorted portion of the array one element at a
 * time until the entire array is sorted.
 *
 * @param arr The array to be sorted.
 * @returns {number[]} A new array representing a sorted copy of the array.
 * @space O(1)
 * @time O(n^2)
 */
export function selectionSort(arr: number[]) {
  const out = [...arr];

  for (let i = 0; i < out.length - 1; i++) {
    let minVal = i;

    for (let j = i + 1; j < out.length; j++) {
      if (out[j] < out[minVal]) {
        minVal = j;
      }
    }

    [out[i], out[minVal]] = [out[minVal], out[i]];
  }

  return out;
}
