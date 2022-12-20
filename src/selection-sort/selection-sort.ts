export class SelectionSort {
  static sort(input: number[]): number[] {
    const nums = [...input];

    for (let i = 1; i < nums.length; i++) {
      let j = i;

      while (j > 0 && nums[j] < nums[j - 1]) {
        [nums[j], nums[j - 1]] = [nums[j - 1], nums[j]];
        j--;
      }
    }

    return nums;
  }
}
