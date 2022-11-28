export class BinarySearch {
  static search(arr: number[], target: number): number {
    this.validate(arr);

    let l = 0;
    let r = arr.length - 1;

    while (l <= r) {
      const mid = Math.floor((l + r) / 2);
      const midVal = arr[mid];

      if (midVal === target) {
        return mid;
      }

      if (midVal < target) {
        l = midVal + 1;
      } else {
        r = midVal - 1;
      }
    }

    return -1;
  }

  static validate(arr: number[]): void {
    const isSorted =
      JSON.stringify(arr) === JSON.stringify([...arr.sort((a, b) => a - b)]);

    if (!isSorted) {
      throw new Error('arr must be sorted');
    }

    const containsDuplicateValues = arr.length !== new Set([...arr]).size;

    if (containsDuplicateValues) {
      throw new Error('arr cannot contain duplicate values');
    }
  }
}
