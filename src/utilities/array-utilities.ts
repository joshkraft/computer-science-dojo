export function generateRandomArray(
  length: number = 10,
  min: number = -10,
  max: number = 10
): number[] {
  const arr = [];

  for (let i = 0; i < length; i++) {
    arr.push(Math.floor(Math.random() * (max - min) + min));
  }

  return arr;
}
