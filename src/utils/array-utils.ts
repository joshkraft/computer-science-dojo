/**
 * Generates an array of random integers within a range.
 *
 * @param length The length of the desired output array.
 * @param min The minimum value possible in the output array (inclusive).
 * @param max The maximum value possible in the output array (exclusive).
 * @returns An array of random integers.
 */
export function generateRandomArray(
  length = 10,
  min = -10,
  max = 10
): number[] {
  const arr: number[] = [];

  for (let i = 0; i < length; i++) {
    arr.push(Math.floor(Math.random() * (max - min) + min));
  }

  return arr;
}

/**
 * Generates a sorted array of integers.
 *
 * @param from The first integer in the sorted array.
 * @param to The last integer in the sorted array.
 * @returns An array of sorted integers.
 */
export function generateSortedArray(from = -10, to = 10): number[] {
  const arr: number[] = [];

  for (let i = from; i <= to; i++) {
    arr.push(i);
  }

  return arr;
}
