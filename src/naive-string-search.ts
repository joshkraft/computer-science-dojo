/**
 * Performs a naive search to find all occurrences of the needle string in the
 * haystack string.
 *
 * @param haystack The string to search in.
 * @param needle The string to search for.
 * @returns An array of [start, end] coords of all occurrences of needle in haystack.
 * @space O(1)
 * @time O(n * m)
 * - n: length of haystack
 * - m: length of needle
 */
export function naiveStringSearch(
  haystack: string,
  needle: string
): number[][] {
  if (haystack === needle) {
    return [[0, needle.length - 1]];
  }

  const matches: number[][] = [];

  for (let l = 0; l < haystack.length - needle.length; l++) {
    let isMatch = true;

    for (let r = 0; r < needle.length; r++) {
      if (haystack[l + r] !== needle[r]) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) {
      matches.push([l, l + needle.length - 1]);
    }
  }

  return matches;
}
