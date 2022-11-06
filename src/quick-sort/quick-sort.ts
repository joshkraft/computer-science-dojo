export class QuickSort {
  static sort(arr: number[]): number[] {
    function quickSort(arr: number[]): number[] {
      if (arr.length <= 1) {
        return arr;
      }

      const pivotIdx = Math.floor(arr.length / 2);
      const pivotVal = arr[pivotIdx];
      const lessThan = [];
      const greaterThan = [];

      for (let i = 0; i < arr.length; i++) {
        if (i === pivotIdx) {
          continue;
        } else if (arr[i] < pivotVal) {
          lessThan.push(arr[i]);
        } else {
          greaterThan.push(arr[i]);
        }
      }

      return [...quickSort(lessThan), pivotVal, ...quickSort(greaterThan)];
    }

    const clonedArr = [...arr];
    return quickSort(clonedArr);
  }
}
